import express from "express";
import { NotAuthorizedError, NotFoundError } from "src/errors";
import { protectedRoute } from "src/middleware/protected-route";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

import User, { UserType } from "../models/user";

const userRouter = express.Router();
userRouter.use(protectedRoute);

userRouter.get(
  "/:id",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const uid = req.params.id;
    const reqUser = res.locals.user;

    try {
      if (uid !== reqUser.id || reqUser.role !== UserType.COORDINATOR) {
        throw new NotAuthorizedError();
      }

      const user = await User.findOne(uid);

      if (!user) {
        throw new NotFoundError();
      }

      res.json({
        status: 200,
        message: "Successfully fetched user",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
);

userRouter.get(
  "/",
  async (
    _: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.json({
      status: 200,
      message: "Successfully fetched users",
      data: res.locals.user,
    });
    next();
  }
);

userRouter.patch(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let user = res.locals.user;
    const body: QueryDeepPartialEntity<User> = req.body;

    // TODO: Make a type for the body
    try {
      user = await User.update(user.id, body);
      res.json({
        status: 200,
        message: "Successfully updated user",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default userRouter;
