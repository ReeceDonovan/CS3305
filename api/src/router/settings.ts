/**
 * Temporary file, until there is a better place to put this
 */
import express from "express";

import config, { configInterface } from "../config/config";
import { protectedRoute } from "../middleware/protected-route";

const settingsRouter = express.Router();
settingsRouter.use(protectedRoute);

settingsRouter.get(
  "/settings",
  (_: express.Request, res: express.Response, next: express.NextFunction) => {
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
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // FIXME
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
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
