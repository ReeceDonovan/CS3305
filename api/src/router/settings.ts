/**
 * Temporary file, until there is a better place to put this
 */
import express from "express";
import config, { configInterface } from "../config/config";
import { UserType } from "../models/user";
import response from "../utils/response";

const settingsRouter = express.Router();

settingsRouter.get(
  "/settings",
  (req: express.Request, res: express.Response) => {
    if (req.user.role === UserType.COORDINATOR) {
      const authorizedResponse: response = {
        data: config.get(),
        message: "Success",
        status: 200,
      };
      res.status(200).send(authorizedResponse);
    } else {
      const unauthorizedResponse: response = {
        data: null,
        message: "Unauthorized",
        status: 401,
      };
      res.status(401).send(unauthorizedResponse);
    }
  }
);

settingsRouter.post(
  "/settings",
  (req: express.Request, res: express.Response) => {
    if (req.user.role === UserType.COORDINATOR) {
      const authorizedResponse: response = {
        data: null,
        message: "Success",
        status: 200,
      };
      const data: configInterface = req.body;
      config.set(data);
      res.status(200).send(authorizedResponse);
    } else {
      const unauthorizedResponse: response = {
        data: null,
        message: "Unauthorized",
        status: 401,
      };
      res.status(401).send(unauthorizedResponse);
    }
  }
);

export default settingsRouter;
