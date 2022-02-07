import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { getRepository, In, Repository } from "typeorm";

import { NotAuthorizedError, NotFoundError } from "../errors";
import { protectedRoute } from "../middleware/protected-route";
import Application from "../models/application";
import User, { UserType } from "../models/user";
import UsersApplications, { RoleType } from "../models/usersApplications";
import Response from "../utils/response";

const upload = multer({ storage: multer.memoryStorage() });
const appRouter = express.Router();
appRouter.use(protectedRoute);

const check_access_app = async (application: Application, user: User) => {
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

appRouter.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const target = req.query.t;
    const user = res.locals.user;
    let response: Response;
    try {
      switch (target) {
        case "all": {
          if (user.role !== UserType.COORDINATOR)
            throw new NotAuthorizedError();
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
  }
);

appRouter.get(
  "/:id",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const user = res.locals.user;
    const applicationId = req.params.id;

    try {
      const application = await Application.findOne(applicationId);

      if (!application) throw new NotFoundError();

      if (!check_access_app(application, user)) throw new NotAuthorizedError();

      res.json({
        status: 200,
        message: "Successfully retrieved application",
        data: application,
      });
    } catch (err) {
      next(err);
    }
  }
);

appRouter.get(
  "/:id/form",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const user = res.locals.user;
    const applicationId = req.params.id;

    try {
      const application = await Application.findOne(applicationId);

      if (!application) throw new NotFoundError();

      if (!check_access_app(application, user)) throw new NotAuthorizedError();

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
  }
);

appRouter.post(
  "/",
  // upload.fields(uploadSchema),
  upload.single("pdf_form"),
  async (req: any, res: express.Response, next: express.NextFunction) => {
    const user = res.locals.user;

    // TODO: Add a type for the form schema
    const form = JSON.parse(req.body.meta_data);

    // TODO: Add validation on the backend for email fields (and text fields if needed)
    const coauthor_emails: string[] = form.coauthors;
    const supervisor_emails: string[] = form.supervisors;

    try {
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

      const userApplication = new UsersApplications({
        application,
        user,
        role: RoleType.SUBMITTER,
      });

      await userApplicationRepository.save(userApplication);

      req.file.originalname.replace(" ", "%20");

      fs.mkdirSync(
        path.join(__dirname, `../../../data/pdf_store/${application.id}`)
      );

      fs.writeFile(
        path.join(
          __dirname,
          `../../../data/pdf_store/${application.id}/form.pdf`
        ),
        req.file.buffer,
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
  }
);

appRouter.patch(
  "/:id",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const body: Partial<Application> = req.body;
    const user = res.locals.user;
    const applicationId = req.params.id;

    try {
      const application = await Application.findOne(applicationId);

      if (!application) throw new NotFoundError();

      if (!check_access_app(application, user)) throw new NotAuthorizedError();

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
  }
);

appRouter.delete(
  "/:id",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const user = res.locals.user;
    const applicationId = req.params.id;

    try {
      const application = await Application.findOne(applicationId);

      if (!application) throw new NotFoundError();

      if (!check_access_app(application, user)) throw new NotAuthorizedError();

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
  }
);

export default appRouter;
