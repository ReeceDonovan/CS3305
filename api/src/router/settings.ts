/**
 * Temporary file, until there is a better place to put this
 */
import express from "express";

import config, { configInterface } from "../config/config";
import { protectedRoute } from "../middleware/protected-route";
import reqUser from "../middleware/store-user";

const getSettings = (
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
};

const updateSettings = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
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
};

const settingsRouter = express.Router();
settingsRouter.use(protectedRoute);

settingsRouter.get("/", reqUser, getSettings);
settingsRouter.post("/", reqUser, updateSettings);

export default settingsRouter;
