import express from "express";
// import { NotAuthorizedError } from "../errors";
import User from "../models/user";

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

const getUsersPermissions = async (
  _: express.Request,
  res: express.Response,
  next: express.NextFunction
) => { 
  // const user = res.locals.user;

  try {
    // if (user.role !== UserType.COORDINATOR) throw new NotAuthorizedError();
    const users = await User.find();
    res.json({
      status: 200, 
      message: "Successfully fetched users",
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// const changeUserPermission = async (
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) => {
//   res.json({
//     status: 200,
//     message: "Hi",
//   })
// }

const adminRouter = express.Router();
adminRouter.use(protectedRoute);

adminRouter.get("/settings", reqUser, getSettings);
adminRouter.post("/settings", reqUser, updateSettings);
adminRouter.get("/users", reqUser, getUsersPermissions)
// adminRouter.patch("/users", reqUser, changeUserPermission)


export default adminRouter;
