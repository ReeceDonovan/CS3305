import express from "express";
import Application from "../models/application";
import response from "../utils/response";

import multer from "multer";
import fs from "fs";
import path from "path";
import User from "../models/user";
import Response from "../utils/response";

const upload = multer({ storage: multer.memoryStorage() });
const appRouter = express.Router();

appRouter.get("/:id", async (req: express.Request, res: express.Response) => {
  const application = await Application.getById(parseInt(req.params.id));
  let re: Response;
  if (application === undefined) {
    re = {
      status: 404,
      message: "Application not found",
      data: null,
    };
  }

  re = {
    status: 200,
    message: "Success",
    data: application,
  };
  res.json(re);
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

// const uploadSchema: Array<multer.Field> = [
//   // maximum of one form allowed
//   { name: "pdf_form", maxCount: 1 },
//   // any number of generics "files" allowed
//   { name: "files" },
// ];

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
      supervisors: supervisors,
      coauthors: coauthors,
    });

    await application.save();
    if (application.id) {
      try {
        // console.log(req.file);
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
        res.json(response);
      } catch (e) {
        const response: Response = {
          status: 500,
          message: "Internal Server Error",
          data: null,
        };
        console.error("Error writing application form to disk\n", e);
        res.status(500).json(response);
      }
    }
  }
);

appRouter.put("/:id", async (req: express.Request, res: express.Response) => {
  const body = req.body;
  let application = await Application.getById(parseInt(req.params.id));
  if (application) {
    application = { ...body };
    console.log(application);
    application.save();
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

appRouter.delete("/:id", async (req: express.Request, res: express.Response) => {
  const application = await Application.getById(parseInt(req.params.id));
  if (application) {
    application.softRemove();
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
})

export default appRouter;
