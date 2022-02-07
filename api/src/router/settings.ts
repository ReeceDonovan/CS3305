/**
 * Temporary file, until there is a better place to put this
 */
import express from "express";
import { protectedRoute } from "src/middleware/protected-route";

import config, { configInterface } from "../config/config";

const settingsRouter = express.Router();
settingsRouter.use(protectedRoute);

settingsRouter.get(
  "/settings",
  async (
    _: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      res.json({
        status: 200,
        message: "Success",
        data: config.get(),
      });
    } catch (error) {
      next(error);
    }
  }
);

settingsRouter.post(
  "/settings",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const config_data: configInterface = req.body;
    try {
      config.set(config_data);
      res.json({
        status: 200,
        message: "Success",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default settingsRouter;
