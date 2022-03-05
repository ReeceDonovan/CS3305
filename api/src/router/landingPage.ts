import express from "express";
import DOMPurify from "isomorphic-dompurify";
import multer from "multer";
import showdown from "showdown";
import reqUser from "../middleware/store-user";

import config from "../config/config";
import { getRepository, Repository } from "typeorm";
import User, { UserType } from "../models/user";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { BadRequestError } from "../errors/bad-request-error";

import fs from "fs";
import path from "path";
import { InternalError } from "../errors/internal-error";
const aboutRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const aboutPage = (_req: express.Request, res: express.Response) => {
  const converter = new showdown.Converter();
  res.set("Content-Type", "text/html");
  return res.send(
    DOMPurify.sanitize(converter.makeHtml(config.get().landingPageMD))
  );
};

const uploadForm = async (req: express.Request, res: express.Response) => {
  const file = req.file;
  const user = req.user;
  if (user) {
    const userRepository: Repository<User> = getRepository(User);

    const dbUser = await userRepository.findOne(user.id);
    if (!dbUser) throw new NotAuthorizedError();
    if (dbUser.role !== UserType.COORDINATOR) {
      return res.status(403).send("You are not authorized to upload this file");
    } else {
      if (!file) throw new BadRequestError("No file uploaded");

      file.originalname.replace(" ", "%20");
      if (fs.existsSync(path.join(__dirname, "../../../data"))) {
        fs.writeFile(
          path.join(__dirname, `../../../data/${file.originalname}`),
          file.buffer,
          (err) => {
            if (err) throw new InternalError("Error uploading file");
          }
        );
      } else {
        fs.mkdirSync(path.join(__dirname, "../../../data"));
        fs.writeFile(
          path.join(__dirname, `../../../data/${file.originalname}`),
          file.buffer,
          (err) => {
            if (err) throw new InternalError("Error uploading file");
          }
        );
      }
      return res.status(200).send("File uploaded");
    }
  }
  return res.status(403).send("You are not authorized to upload this file");
};

aboutRouter.get("/", aboutPage);
aboutRouter.post("/form", reqUser, upload.single("form"), uploadForm);

aboutRouter.get("/form", (_req: express.Request, res: express.Response) => {
  const file = `${__dirname}../../../data/form.pdf}`;
  res.download(file);
});

export default aboutRouter;
