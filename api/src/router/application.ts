/* eslint-disable @typescript-eslint/no-unused-vars */
/* FIXME: Make form from body.meta_data in the `createApplication` function type safe. TS throws errors unless we disable these rules for now. */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response, Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { getRepository, Repository } from "typeorm";

import {
  BadRequestError,
  ConflictError,
  NotAuthorizedError,
  NotFoundError,
} from "../errors";
import { InternalError } from "../errors/internal-error";
import { protectedRoute } from "../middleware/protected-route";
import reqUser from "../middleware/store-user";
import Application, { AppStatus } from "../models/application";
import Review, { ReviewStatus } from "../models/review";
import User, { UserType } from "../models/user";
import UsersApplications, { RoleType } from "../models/usersApplications";
import response from "../utils/response";

const upload = multer({ storage: multer.memoryStorage() });

const check_access = async (application: Application, user: User) => {
  if (user.role === UserType.COORDINATOR) {
    return true;
  }

  const userApplicationRepo: Repository<UsersApplications> =
    getRepository(UsersApplications);

  const userApplication = await userApplicationRepo.findOne({
    application,
    user,
  });

  return userApplication !== undefined;
};

const getApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const target = req.query.t;
  const user = res.locals.user;
  let response: response;
  try {
    switch (target) {
      case "all": {
        if (user.role !== UserType.COORDINATOR) throw new NotAuthorizedError();
        const applications = await getRepository(Application).find();
        response = {
          status: 200,
          message: "Successfully retrieved all applications",
          data: applications,
        };
        break;
      }
      case "review": {
        const userApplication = await getRepository(UsersApplications).find({
          where: {
            user,
            role: RoleType.REVIEWER,
          },
          relations: ["application"],
        });

        const applications = userApplication.map((u) => u.application);

        response = {
          status: 200,
          message: "Successfully retrieved all applications",
          data: applications,
        };
        break;
      }
      default: {
        const userApplications = await getRepository(UsersApplications).find({
          where: {
            user,
            role:
              RoleType.SUBMITTER || RoleType.COAUTHOR || RoleType.SUPERVISOR,
          },
          relations: [
            "application",
            "application.usersApplications",
            "application.usersApplications.user",
          ],
        });

        const applications = userApplications.map((u) => u.application);

        response = {
          status: 200,
          message: "Successfully retrieved all applications",
          data: applications,
        };
        break;
      }
    }
    res.json(response);
  } catch (err) {
    next(err);
  }
};

const getApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;
  const applicationId = req.params.id;

  try {
    const application = await Application.findOne({
      where: { id: applicationId },
      relations: [
        "reviews",
        "reviews.user",
        "usersApplications",
        "usersApplications.user",
      ],
    });

    if (!application) throw new NotFoundError();

    if (!(await check_access(application, user)))
      throw new NotAuthorizedError();

    res.json({
      status: 200,
      message: "Successfully retrieved application",
      data: application,
    });
  } catch (err) {
    next(err);
  }
};

const getApplicationForm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;
  const applicationId = req.params.id;

  try {
    const application = await Application.findOne(applicationId);

    if (!application) throw new NotFoundError();

    if (!(await check_access(application, user)))
      throw new NotAuthorizedError();

    const files = fs.readdirSync(
      path.join(__dirname, `../../../data/pdf_store/${application.id}`)
    );

    if (files.includes("form.pdf")) {
      res.download(
        path.join(
          __dirname,
          `../../../data/pdf_store/${application.id}/form.pdf`
        )
      );
    }
  } catch (err) {
    next(err);
  }
};

// need req otherwise res.locals.user is undefined
const createApplication = async ( _req: Request, res: Response ) => {
  const user = res.locals.user;

  const new_application = await new Application({ hasFile: false }).save();

  const userApplicationRepository: Repository<UsersApplications> =
    getRepository(UsersApplications);

  const submitterApplication = new UsersApplications({
    application: new_application,
    user: user,
    role: RoleType.SUBMITTER,
  });

  const newRelation = await userApplicationRepository.save(
    submitterApplication
  );

  if (!newRelation) throw new InternalError();

  res.send({
    status: 201,
    message: "Successfully created application",
    data: new_application.id,
  });
};

const updateApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = req.body;
  const user = res.locals.user;
  const applicationId = req.params.id;

  try {
    const applicationRepository: Repository<Application> =
      getRepository(Application);

    const userRepository: Repository<User> = getRepository(User);

    const userApplicationRepository: Repository<UsersApplications> =
      getRepository(UsersApplications);

    const application = await applicationRepository.findOne(applicationId);

    if (!application) throw new NotFoundError();

    if (!(await check_access(application, user)))
      throw new NotAuthorizedError();

    const updated_application = await applicationRepository.save({
      ...application,
      ...body,
    });

    if (!updated_application) throw new InternalError();

    const request_coauthor_emails: string[] = body.coauthors
      ? body.coauthors
      : [];
    const request_supervisor_emails: string[] = body.supervisors
      ? body.supervisors
      : [];

    const current_coauthors = await userApplicationRepository.find({
      where: {
        application: updated_application,
        role: RoleType.COAUTHOR,
      },
      relations: ["user"],
    });

    const current_supervisors = await userApplicationRepository.find({
      where: {
        application: updated_application,
        role: RoleType.SUPERVISOR,
      },
      relations: ["user"],
    });

    for (const coauthor of current_coauthors) {
      if (!request_coauthor_emails.includes(coauthor.user.email)) {
        await userApplicationRepository.remove(coauthor);
      }
    }

    for (const supervisor of current_supervisors) {
      if (!request_supervisor_emails.includes(supervisor.user.email)) {
        await userApplicationRepository.remove(supervisor);
      }
    }

    for (const coauthor_email of request_coauthor_emails) {
      const coauthor = await userRepository.findOne({
        where: { email: coauthor_email },
      });

      if (!coauthor) throw new NotFoundError();

      const coauthor_application = new UsersApplications({
        application: updated_application,
        user: coauthor,
        role: RoleType.COAUTHOR,
      });

      const newRelation = await userApplicationRepository.save(
        coauthor_application
      );

      if (!newRelation) throw new InternalError();
    }

    for (const supervisor_email of request_supervisor_emails) {
      const supervisor = await userRepository.findOne({
        where: { email: supervisor_email },
      });

      if (!supervisor) throw new NotFoundError();

      const supervisor_application = new UsersApplications({
        application: updated_application,
        user: supervisor,
        role: RoleType.SUPERVISOR,
      });

      const newRelation = await userApplicationRepository.save(
        supervisor_application
      );

      if (!newRelation) throw new InternalError();
    }

    res.send({
      status: 200,
      message: "Successfully updated application",
      data: updated_application,
    });
  } catch (err) {
    next(err);
  }
};

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  const file = req.file;
  const user = res.locals.user;
  const applicationId = req.params.id;

  try {
    const application = await Application.findOne(applicationId);

    if (!application) throw new NotFoundError();

    if (!(await check_access(application, user)))
      throw new NotAuthorizedError();

    if (!file) throw new BadRequestError("No file was uploaded");

    file.originalname.replace(" ", "%20");

    if (
      fs.existsSync(
        path.join(__dirname, `../../../data/pdf_store/${applicationId}`)
      )
    ) {
      if (
        !fs.existsSync(
          path.join(
            __dirname,
            `../../../data/pdf_store/${applicationId}/form.pdf`
          )
        )
      ) {
        fs.writeFile(
          path.join(
            __dirname,
            `../../../data/pdf_store/${applicationId}/form.pdf`
          ),
          file.buffer,
          (err) => {
            if (err) throw err;
          }
        );
        application.hasFile = true;
        await application.save();

        res.json({
          status: 200,
          message: "Successfully updated file",
        });
      } else {
        throw new ConflictError("File");
      }
    } else {
      fs.mkdirSync(
        path.join(__dirname, `../../../data/pdf_store/${applicationId}`)
      );
      fs.writeFile(
        path.join(
          __dirname,
          `../../../data/pdf_store/${applicationId}/form.pdf`
        ),
        file.buffer,
        (err) => {
          if (err) throw err;
        }
      );
      application.hasFile = true;
      await application.save();

      res.json({
        status: 200,
        message: "Successfully updated file",
      });
    }
  } catch (err) {
    next(err);
  }
};

const deleteApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;
  const applicationId = req.params.id;

  try {
    const application = await Application.findOne(applicationId);

    if (!application) throw new NotFoundError();

    if (!(await check_access(application, user)))
      throw new NotAuthorizedError();

    const applicationRepository: Repository<Application> =
      getRepository(Application);

    if (
      fs.existsSync(
        path.join(
          __dirname,
          `../../../data/pdf_store/${applicationId}/form.pdf`
        )
      )
    ) {
      fs.unlinkSync(
        path.join(
          __dirname,
          `../../../data/pdf_store/${applicationId}/form.pdf`
        )
      );
    }

    // TODO: Test that this cascades to the user_application join table
    await applicationRepository.delete(application.id);

    res.json({
      status: 200,
      message: "Successfully deleted application",
    });
  } catch (err) {
    next(err);
  }
};

const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  const applicationId = req.params.id;

  try {
    const application = await Application.findOne(applicationId);

    if (!application) throw new NotFoundError();

    if (!(await check_access(application, user)))
      throw new NotAuthorizedError();

    if (
      fs.existsSync(
        path.join(
          __dirname,
          `../../../data/pdf_store/${applicationId}/form.pdf`
        )
      )
    ) {
      fs.unlinkSync(
        path.join(
          __dirname,
          `../../../data/pdf_store/${applicationId}/form.pdf`
        )
      );
    } else {
      throw new NotFoundError();
    }

    application.hasFile = false;
    await application.save();

    res.json({
      status: 200,
      message: "Successfully deleted file",
    });
  } catch (err) {
    next(err);
  }
};

// TODO: Needs testing from this endpoint and down
// Application -> Review routes
const getReviewsByApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;
  const applicationId = req.params.id;

  try {
    const application = await Application.findOne(applicationId);

    if (!application) throw new NotFoundError();

    if (!(await check_access(application, user)))
      throw new NotAuthorizedError();

    const reviews = await Review.find({
      where: {
        application,
      },
      relations: ["user"],
    });

    if (!reviews) throw new NotFoundError();

    reviews.forEach((review) => {
      if (
        res.locals.user.role !== UserType.COORDINATOR ||
        res.locals.user != review.user
      ) {
        reviews.splice(reviews.indexOf(review), 1);
      }
    });

    if (!reviews) throw new NotFoundError();

    res.json({
      status: 200,
      message: "Successfully retrieved reviews",
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

const assignReviewers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  if (user.role != UserType.COORDINATOR) {
    throw new NotAuthorizedError();
  }

  const applicationId = req.params.id;
  const body: User[] = req.body;

  try {
    const application = await Application.findOne(applicationId);
    if (!application) throw new NotFoundError();

    const userApplicationRepository: Repository<UsersApplications> =
      getRepository(UsersApplications);

    body.map(async (reviewer) => {
      const reviewerUser = await User.findOne(reviewer.id);
      if (!reviewerUser) throw new NotFoundError();

      const existing = await userApplicationRepository.findOne({
        where: {
          user: reviewerUser,
          application,
          role: !RoleType.REVIEWER,
        },
      });

      if (existing) {
        throw new ConflictError(
          `User ${reviewerUser.email} already assigned to application`
        );
      }

      const relation = new UsersApplications({
        user: reviewerUser,
        application,
        role: RoleType.REVIEWER,
      });

      const savedRelation = await userApplicationRepository.save(relation);
      if (!savedRelation) throw new InternalError();
    });

    application.app_status = AppStatus.REVIEW;

    await application.save();

    return res.json({
      status: 200,
      message: "Successfully assigned reviewers",
    });
  } catch (err) {
    return next(err);
  }
};

const createReviewByApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;
  const applicationId = req.params.id;
  const body: Partial<Review> = req.body;

  try {
    const application = await Application.findOne(applicationId);

    if (!application) throw new NotFoundError();

    if (!(await check_access(application, user)))
      throw new NotAuthorizedError();

    const reviewRepository: Repository<Review> = getRepository(Review);

    const review = new Review({
      ...body,
      application,
      user,
    });
    if (
      body.status &&
      (body.status === ReviewStatus.APPROVED ||
        body.status === ReviewStatus.DECLINED)
    ) {
      // find if every reviewer has made a review, if so check that all
      // reviewers have made a review with a status
      const reviews = await reviewRepository.find({
        where: {
          application,
        },
        relations: ["user"],
      });

      if (reviews.length === 0) {
        throw new InternalError();
      }

      const reviewers = await UsersApplications.find({
        where: {
          application,
          role: RoleType.REVIEWER,
        },
        relations: ["user", "user.reviews"],
      });

      // check if all reviewers have made a review
      const allReviewersReviewed = reviewers.every(
        (reviewer: UsersApplications) => {
          return reviews.some((review) => {
            return review.user.id === reviewer.user.id && review.status;
          });
        }
      );

      if (!allReviewersReviewed) {
        console.log("1 Not all reviewers have made a review");
      } else {
        application.app_status = AppStatus.PENDING;
        await application.save();
      }
    }

    const savedReview = await reviewRepository.save(review);

    res.json({
      status: 201,
      message: "Successfully created review",
      data: savedReview,
    });
  } catch (err) {
    next(err);
  }
};

const appRouter = Router();
appRouter.use(protectedRoute);

appRouter.get("/", reqUser, getApplications);
appRouter.get("/:id", reqUser, getApplication);
appRouter.get("/:id/form", reqUser, getApplicationForm);
appRouter.post("/", reqUser, createApplication);
appRouter.patch("/:id", reqUser, updateApplication);
appRouter.post("/:id/form", upload.single("pdf_form"), reqUser, uploadFile);
appRouter.delete("/:id", reqUser, deleteApplication);
appRouter.delete("/:id/form", reqUser, deleteFile);
appRouter.put("/:id/reviewers", reqUser, assignReviewers);
appRouter.get("/:id/reviews", reqUser, getReviewsByApplication);
appRouter.post("/:id/reviews", reqUser, createReviewByApplication);

export default appRouter;
