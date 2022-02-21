/* eslint-disable @typescript-eslint/no-unused-vars */
/* FIXME: Make form from body.meta_data in the `createApplication` function type safe. TS throws errors unless we disable these rules for now. */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response, Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { getRepository, In, Repository } from "typeorm";

import { BadRequestError, ConflictError, NotAuthorizedError, NotFoundError } from "../errors";
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
          where: {
            user,
          },
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

// need req otherwise res.locals.user is undefined
const createApplication = async ( _req: Request, res: Response ) => {
  const user = res.locals.user;

  const new_application = await new Application({hasFile: false}).save();

  const userApplicationRepository: Repository<UsersApplications> = getRepository(UsersApplications);

  const submitterApplication = new UsersApplications({
      application: new_application,
      user: user,
      role: RoleType.SUBMITTER,
    });

  await userApplicationRepository.save(submitterApplication);

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

  // TODO: Add validation on the backend for email fields (and text fields if needed)
  const coauthor_emails: string[] = body.coauthors;
  const supervisor_emails: string[] = body.supervisors;

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
    }) as Application;

    if (coauthor_emails){
      const new_coauthors = await User.find({
      where: {
        email: In(coauthor_emails),
      },
      });

      const curr_coathors = await UsersApplications.find({
        where: {
          application: application,
          role: RoleType.COAUTHOR
        }
      });

      //for loops add new user application links as new they are found to be missing
      for (const new_user of new_coauthors){
        let found_flag = false;
        for ( let i = 0; i < curr_coathors.length; i++ ){
          const curr_user = curr_coathors[i];
          if (new_user.id === curr_user.user.id){
            curr_coathors.splice(i, 1);
            found_flag = true;
            break;
          }
        }

        if ( found_flag === false ){
          const new_link = new UsersApplications({
            user,
            application: updatedApplication,
            role: RoleType.COAUTHOR
          });

          await new_link.save();
        }
      }

      //left over curr_coauthors are links that no longer exist
      for (const del_user of curr_coathors){
        await del_user.remove();
      }
    }

    if (supervisor_emails){

      const new_supervisors = await User.find({
        where: {
          email: In(supervisor_emails),
        },
      });

      const curr_supervisors = await UsersApplications.find({
        where: {
          application: application,
          role: RoleType.SUPERVISOR
        }
      });

      //for loops add new user application links as new they are found to be missing
      for (const new_user of new_supervisors){
        let found_flag = false;
        for ( let i = 0; i < curr_supervisors.length; i++ ){
          const curr_user = curr_supervisors[i];
          if (new_user.id === curr_user.user.id){
            curr_supervisors.splice(i, 1);
            found_flag = true;
            break;
          }
        }

        if ( found_flag === false ){
          const new_link = new UsersApplications({
            user,
            application: updatedApplication,
            role: RoleType.SUPERVISOR
          });

          await new_link.save();
        }
      }

      //left over curr_coauthors are links that no longer exist
      for (const del_user of curr_supervisors){
        await del_user.remove();
      }

    }
    

    res.json({
      status: 200,
      message: "Successfully updated application",
      data: updatedApplication,
    });
  } catch (err) {
    next(err);
  }
};

const uploadFile = async (req: Request, res:Response, next: NextFunction) => {
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

    if (fs.existsSync(path.join(__dirname, `../../../data/pdf_store/${applicationId}`))) {
      if (!fs.existsSync(path.join(__dirname, `../../../data/pdf_store/${applicationId}/form.pdf`))) {
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

     if (fs.existsSync(path.join(__dirname, `../../../data/pdf_store/${applicationId}/form.pdf`))) {
      fs.unlinkSync(path.join(__dirname, `../../../data/pdf_store/${applicationId}/form.pdf`));
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

  try{
    const application = await Application.findOne(applicationId);

    if (!application) throw new NotFoundError();

    if (!(await check_access(application, user))) throw new NotAuthorizedError();

    if (fs.existsSync(path.join(__dirname, `../../../data/pdf_store/${applicationId}/form.pdf`))) {
      fs.unlinkSync(path.join(__dirname, `../../../data/pdf_store/${applicationId}/form.pdf`));
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
      relations: ["application", "user"],
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
appRouter.post("/", reqUser, createApplication);
appRouter.patch("/:id", reqUser, updateApplication);
appRouter.post("/:id/form", upload.single("pdf_form"), reqUser, uploadFile);
appRouter.delete("/:id", reqUser, deleteApplication);
appRouter.delete("/:id/form", reqUser, deleteFile);
appRouter.get("/:id/reviews", reqUser, getReviewsByApplication);
appRouter.post("/:id/reviews", reqUser, createReviewByApplication);

export default appRouter;
