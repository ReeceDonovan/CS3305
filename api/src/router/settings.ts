/**
 * Temporary file, until there is a better place to put this
 */
import express from "express";
import config, { configInterface } from "../config/config";
import { UserType } from "../models/user";
import response, { sample_401_res } from "../utils/response";

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
      return res.status(401).json(sample_401_res);
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
      return res.status(401).json(sample_401_res);
    }
  }
);

export default settingsRouter;
