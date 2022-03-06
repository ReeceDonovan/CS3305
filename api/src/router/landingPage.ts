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

/**
 * @swagger
 * /api/about:
 *   get:
 *     tags: [Other]
 *     summary: Get about page content
 *     responses:
 *       200:
 *         description: Successfully assigned reviewers
 *         content:
 *           text/html:
 *             schema:
 *              type: string
 */
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
    try {
      if (!dbUser) throw new NotAuthorizedError();
      if (dbUser.role !== UserType.COORDINATOR) {
        return res
          .status(403)
          .send("You are not authorized to upload this file");
      } else {
        if (!file) throw new BadRequestError("No file uploaded");

        file.originalname.replace(" ", "%20");
        if (fs.existsSync(path.join(__dirname, "../../../data"))) {
          fs.writeFile(
            path.join(__dirname, "../../../data/form.pdf"),
            file.buffer,
            (err) => {
              if (err) throw new InternalError("Error uploading file");
            }
          );
        } else {
          fs.mkdirSync(path.join(__dirname, "../../../data"));
          fs.writeFile(
            path.join(__dirname, "../../../data/form.pdf"),
            file.buffer,
            (err) => {
              if (err) throw new InternalError("Error uploading file");
            }
          );
        }
        return res.status(200).send("File uploaded");
      }
    } catch (e) {
      throw new InternalError("Error uploading file");
    }
  }
  return res.status(403).send("You are not authorized to upload this file");
};

const deleteForm = async (req: express.Request, res: express.Response) => {
  const user = req.user;
  if (!user) throw new NotAuthorizedError();
  try {
    if (user) {
      const userRepository: Repository<User> = getRepository(User);
      const dbUser = await userRepository.findOne(user.id);
      if (!dbUser || dbUser.role !== UserType.COORDINATOR)
        throw new NotAuthorizedError();

      const files = fs.readdirSync(path.join(__dirname, "../../../data"));

      if (files.includes("form.pdf")) {
        fs.unlinkSync(path.join(__dirname, "../../../data/form.pdf"));
        return res.status(200).send("File deleted");
      } else {
        return res.status(404).send("File not found");
      }
    }
  } catch (e) {
    throw new InternalError("Error deleting file");
  }
  return res.status(403).send("You are not authorized to delete this file");
};

aboutRouter.get("/", aboutPage);
aboutRouter.post("/form", reqUser, upload.single("pdf_form"), uploadForm);
aboutRouter.delete("/form", reqUser, deleteForm);

aboutRouter.get("/form", (_req: express.Request, res: express.Response) => {
  const files = fs.readdirSync(path.join(__dirname, "../../../data"));

  if (files.includes("form.pdf")) {
    res.download(path.join(__dirname, "../../../data/form.pdf"));
  } else {
    res.status(404).send("File not found");
  }
});

export default aboutRouter;
