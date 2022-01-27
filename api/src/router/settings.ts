/**
 * Temporary file, until there is a better place to put this
 */
import express from "express";
import config, { configInterface } from "../config/config";
import response from "../utils/response";

const settingsRouter = express.Router();

settingsRouter.get("/settings", (req: express.Request, res: express.Response) => {
  if (req.user.type === "ADMIN") {
    res.send(config.get())
  } else {
    const unauthorizedResponse: response = {
      data: null,
      message: "Unauthorized",
      status: 401,
    };
    res.status(401).send(unauthorizedResponse)
  }
});

settingsRouter.post("/settings", (req: express.Request, res: express.Response) => {
  if (req.user.type === "ADMIN") {
    const data: configInterface = req.body
    config.update(data)
    res.status(200).send()
  } else {
    const unauthorizedResponse: response = {
      data: null,
      message: "Unauthorized",
      status: 401,
    };
    res.status(401).send(unauthorizedResponse)
  }
});

export default settingsRouter;