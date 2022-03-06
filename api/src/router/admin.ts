import express from "express";

import config, { configInterface } from "../config/config";
import { protectedRoute } from "../middleware/protected-route";
import reqUser from "../middleware/store-user";

const getSettings = async (
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

const updateSettings = async (
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
};

const adminRouter = express.Router();
adminRouter.use(protectedRoute);

adminRouter.get("/settings", reqUser, getSettings);
adminRouter.post("/settings", reqUser, updateSettings);


export default adminRouter;
