import e from "express";
import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { getRepository } from "typeorm";
import Application from "../models/application";
import Review, { ReviewStatus } from "../models/review";
import User, { UserType} from "../models/user";
import Response, { sample_401_res, sample_404_res } from "../utils/response";


const upload = multer({ storage: multer.memoryStorage() });
const appRouter = express.Router();


const check_access_app = (application: Application, user: User) => {
  return application.submitter === user || application.supervisors.includes(user) || application.coauthors.includes(user) || application.reviewers.includes(user) || user.role === "COORDINATOR";
};

appRouter.get("/", async (req: express.Request, res: express.Response) => {
  const target = req.query.t;
  let applications: Array<Application>;
  let response: Response;

  // depending on target and user type, return different applications
  switch (target) {
    case "review":
      if (req.user.role == UserType.REVIEWER) {
        applications = await Application.find({
          relations: ["submitter", "reviews", "reviewers"],
          where: {
            status: ReviewStatus.INREVIEW,
          },
        });

        applications.forEach((application) => {
          // filter out applications that the user is not assigned to review
          if (!application.reviewers.includes(req.user)) {
            applications.splice(applications.indexOf(application), 1);
          }
        });

        response = {
          status: 200,
          message: "Successfully retrieved applications.",
          data: applications,
        };
      } else {
        response = {
          status: 403,
          message: "You are not authorized to view this page.",
          data: null,
        };
      }
      break;

    case "all":
      if (req.user.role == UserType.COORDINATOR) {
        applications = await Application.find();
        response = {
          message: "Success",
          status: 200,
          data: applications,
        };
      } else {
        response = {
          status: 403,
          message: "You are not authorized to view this page.",
          data: null,
        };
      }
      break;

    default:
      applications = await Application.find({
        relations: ["submitter", "reviews", "reviewers"],
        where: {
          submitter: req.user,
        },
      });
      response = {
        message: "Success",
        status: 200,
        data: applications,
      };
  }

  res.json(response);
});

appRouter.get("/:id", async (req: express.Request, res: express.Response) => {
  const application = await Application.getById(parseInt(req.params.id), [
    "submitter",
    "reviews",
    "reviews.reviewer",
    "supervisors",
  ]);
  
  if (!application) {
    return res.status(404).json(sample_404_res);
  }
  if (!check_access_app(application, req.user)){
    return res.status(401).json(sample_401_res);
  }

  const OkResponse: Response = {
    status: 200,
    message: "Success",
    data: application,
  };

  const UnauthorizedResponse: Response = {
    status: 403,
    message: "Forbidden",
    data: null,
  };

  if (req.user.role === UserType.COORDINATOR) {
    if (!application) {
      const re: Response = {
        status: 404,
        message: "Application not found",
        data: null,
      };
      return res.send(UnauthorizedResponse);
    }

    return res.json(OkResponse);
  } else if (req.user.role === UserType.REVIEWER) {
    if (!application.reviewers.includes(req.user)) {
      return res.json(UnauthorizedResponse);
    }
  } else {
    if (
      application.submitter.id === req.user.id ||
      application.supervisors.includes(req.user) ||
      application.coauthors.includes(req.user)
    ) {
      return res.json(OkResponse);
    }
  }

  return res.json(UnauthorizedResponse);
});

appRouter.get(
  "/:id/form",
  async (req: express.Request, res: express.Response) => {
    const application = await Application.getById(parseInt(req.params.id));
    if (!application) {
      return res.status(404).json(sample_404_res);
    }
    if (!check_access_app(application, req.user)){
      return res.status(401).json(sample_401_res);
    }
    const files = fs.readdirSync(
      path.join(
        path.join(__dirname, `../../../data/pdf_store/${application.id}`)
      )
    );
    if (files.includes("form.pdf")) {
      res.download(
        path.join(
          __dirname,
          `../../../data/pdf_store/${application.id}/form.pdf`
        )
      );
    }
  }
);

appRouter.post(
  "/",
  // upload.fields(uploadSchema),
  upload.single("pdf_form"),
  async (req: any, res: express.Response) => {
    const form = JSON.parse(req.body.meta_data);
    // console.log(form);
    const coauthorEmails: string[] = form.coauthors;
    const supervisorEmails: string[] = form.supervisors;

    const coauthors: Array<User> = [];
    const supervisors: Array<User> = [];

    coauthorEmails.forEach((coauthorEmail: string) => {
      User.getByEmail(coauthorEmail).then((user: User) => {
        if (user) {
          coauthors.push(user);
        }
      });
    });

    supervisorEmails.forEach((supervisorEmail: string) => {
      User.getByEmail(supervisorEmail).then((user: User) => {
        if (user) {
          supervisors.push(user);
        }
      });
    });

    const application = new Application({
      name: form.name,
      description: form.description,
      field: form.field,
      submitter: req.user,
      // TODO add round robin algorithm for reviewers
      reviewers: [],
      coauthors,
      supervisors,
    });

    await application.save();
    if (!application.id) {
      const re: Response = {
        status: 500,
        message: "Failed to save application",
        data: null,
      };
      return res.json(re);
    }

    const defaultReview = new Review({
      status: ReviewStatus.PENDING,
      comment: null,
    });

    await application.addReview(defaultReview);

    if (application.id) {
      try {
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
          (_err) => {}
        );
        const response: Response = {
          status: 201,
          message: "Success",
          data: application,
        };
        res.send(JSON.stringify(response));
      } catch (e) {
        const response: Response = {
          status: 500,
          message: "Internal Server Error",
          data: null,
        };
        console.error("Error writing application form to disk\n", e);
        res.status(500).send(JSON.stringify(response));
      }
    }
  }
);

appRouter.patch("/:id", async (req: express.Request, res: express.Response) => {
  // console.log(req.body)
  const body = req.body as Application;
  const application = await Application.getById(parseInt(req.params.id));
  if (!application) {
    return res.status(404).json(sample_404_res);
  }
  if (!check_access_app(application, req.user)){
    return res.status(401).json(sample_401_res);
  }
  if (application) {
    application.name = body.name ? body.name : application.name;
    application.description = body.description
      ? body.description
      : application.description;
    application.field = body.field ? body.field : application.field;
    application.supervisors = body.supervisors
      ? body.supervisors
      : application.supervisors;
    application.coauthors = body.coauthors
      ? body.coauthors
      : application.coauthors;
    await application.save();

    const response: Response = {
      status: 200,
      message: "Success",
      data: application,
    };
    res.json(response);
  } else {
    const response: Response = {
      status: 404,
      message: "Application not found",
      data: null,
    };
    res.json(response);
  }
});

appRouter.delete(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    const application = await Application.getById(parseInt(req.params.id));
    if (!application) {
      return res.status(404).json(sample_404_res);
    }
    if (!check_access_app(application, req.user)){
      return res.status(401).json(sample_401_res);
    }
    if (application) {
      await application.remove();
      const response: Response = {
        status: 200,
        message: "Success",
        data: null,
      };
      res.json(response);
    } else {
      const response: Response = {
        status: 404,
        message: "Application not found",
        data: null,
      };
      res.json(response);
    }
  }
);

export default appRouter;
