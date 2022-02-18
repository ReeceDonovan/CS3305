/* FIXME: Make form from body.meta_data in the `createApplication` function type safe. TS throws errors unless we disable these rules for now. */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response, Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { getRepository, In, Repository } from "typeorm";

import { BadRequestError, NotAuthorizedError, NotFoundError } from "../errors";
import { protectedRoute } from "../middleware/protected-route";
import reqUser from "../middleware/store-user";
import Application from "../models/application";
import Review from "../models/review";
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
          where: [
            { user, role: RoleType.COAUTHOR },
            { user, role: RoleType.SUBMITTER },
            { user, role: RoleType.REVIEWER },
          ],
          relations: ["application"],
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
    const application = await Application.findOne(applicationId);

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

const createApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  // TODO: Add a type for the form schema, see top of file
  const form = JSON.parse(req.body.meta_data);

  // TODO: Add validation on the backend for email fields (and text fields if needed)
  const coauthor_emails: string[] = form.coauthors;
  const supervisor_emails: string[] = form.supervisors;

  const file = req.file;

  try {
    if (!file) throw new BadRequestError("No file was uploaded");

    const coauthor_users = await User.find({
      where: {
        email: In(coauthor_emails),
      },
    });

    const supervisor_users = await User.find({
      where: {
        email: In(supervisor_emails),
      },
    });

    const applicationRepository: Repository<Application> =
      getRepository(Application);

    const temp_application: Partial<Application> = {
      name: form.name,
      description: form.description,
      field: form.field,
    };

    const application = (await applicationRepository.save(
      temp_application
    )) as Application;

    const userApplicationRepository: Repository<UsersApplications> =
      getRepository(UsersApplications);

    for (const coauthor of coauthor_users) {
      const userApplication = new UsersApplications({
        application,
        user: coauthor,
        role: RoleType.COAUTHOR,
      });

      await userApplicationRepository.save(userApplication);
    }

    for (const supervisor of supervisor_users) {
      const userApplication = new UsersApplications({
        application,
        user: supervisor,
        role: RoleType.SUPERVISOR,
      });

      await userApplicationRepository.save(userApplication);
    }

    console.log(user);

    const userApplication = new UsersApplications({
      application,
      user,
      role: RoleType.SUBMITTER,
    });

    await userApplicationRepository.save(userApplication);

    file.originalname.replace(" ", "%20");

    fs.mkdirSync(
      path.join(__dirname, `../../../data/pdf_store/${application.id}`)
    );

    fs.writeFile(
      path.join(
        __dirname,
        `../../../data/pdf_store/${application.id}/form.pdf`
      ),
      file.buffer,
      (err) => {
        if (err) throw err;
      }
    );

    res.json({
      status: 201,
      message: "Successfully created application",
      data: application,
    });
  } catch (err) {
    next(err);
  }
};

const updateApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body: Partial<Application> = req.body;
  const user = res.locals.user;
  const applicationId = req.params.id;

  try {
    const application = await Application.findOne(applicationId);

    if (!application) throw new NotFoundError();

    if (!(await check_access(application, user)))
      throw new NotAuthorizedError();

    const applicationRepository: Repository<Application> =
      getRepository(Application);

    // TODO: Test updating an application (specifically adding/removing coauthors)
    const updatedApplication = await applicationRepository.save({
      ...application,
      ...body,
    });

    res.json({
      status: 200,
      message: "Successfully updated application",
      data: updatedApplication,
    });
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
appRouter.post("/", reqUser, upload.single("pdf_form"), createApplication);
appRouter.patch("/:id", reqUser, updateApplication);
appRouter.delete("/:id", reqUser, deleteApplication);
appRouter.get("/:id/reviews", reqUser, getReviewsByApplication);
appRouter.post("/:id/reviews", reqUser, createReviewByApplication);

export default appRouter;
