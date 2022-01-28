import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { getRepository } from "typeorm";
import Application from "../models/application";
import Review, { ReviewStatus } from "../models/review";
import User from "../models/user";
import Response from "../utils/response";


const upload = multer({ storage: multer.memoryStorage() });
const appRouter = express.Router();

appRouter.get("/", async (req: express.Request, res: express.Response) => {
  const applications = await getRepository(Application).find({
    order: { updatedAt: "DESC" },
    take: 15,
    relations: ["submitter", "reviews"],
  });
  let resp: Response;
  if (applications.length > 0) {
    resp = {
      status: 200,
      message: "Success",
      data: applications,
    };
  } else {
    resp = {
      status: 200,
      message: "No applications found",
      data: null,
    };
  }
  res.json(resp);
});

appRouter.get("/:id", async (req: express.Request, res: express.Response) => {
  const application = await Application.getById(parseInt(req.params.id), [
    "submitter",
    "reviews",
    "reviews.reviewer",
    "supervisors",
  ]);
  if (!application) {
    const re: Response = {
      status: 404,
      message: "Application not found",
      data: null,
    };
    console.log(application);
    return res.send(JSON.stringify(re));
  }

  const re = {
    status: 200,
    message: "Success",
    data: application,
  };
  return res.json(re);
});

appRouter.get(
  "/:id/form",
  async (req: express.Request, res: express.Response) => {
    const application = await Application.getById(parseInt(req.params.id));
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
  async (req: express.Request, res: express.Response) => {
    const form = JSON.parse(req.body.meta_data);
    // console.log(form);
    const coauthorEmails: string[] = form.coauthors;
    const supervisorEmails: string[] = form.supervisors;

    let coauthors: Array<User> = [];
    let supervisors: Array<User> = [];

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
  let application = await Application.getById(parseInt(req.params.id));
  console.log(application);

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
