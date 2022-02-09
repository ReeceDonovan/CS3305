// FIXME
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

import { NotAuthorizedError, NotFoundError } from "../errors";
import { protectedRoute } from "../middleware/protected-route";
import User, { UserType } from "../models/user";
import { RoleType } from "../models/usersApplications";

const userRouter = express.Router();
userRouter.use(protectedRoute);

userRouter.get(
  "/:id",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const uid = parseInt(req.params.id, 10);
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
  (_: express.Request, res: express.Response, next: express.NextFunction) => {
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
    const user = res.locals.user;
    const body: QueryDeepPartialEntity<User> = req.body;

    // TODO: Make a type for the body
    try {
      const updatedUser = await User.update(user.id, body);
      res.json({
        status: 200,
        message: "Successfully updated user",
        data: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }
);

userRouter.get(
  "/reviewers",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const user = res.locals.user;
    const target = req.query.t;

    if (user.role !== UserType.COORDINATOR) throw new NotAuthorizedError();

    try {
      const reviewers = await User.find({
        where: {
          role: UserType.REVIEWER,
        },
      });

      if (!reviewers) throw new NotFoundError();

      switch (target) {
        case "suggest": {
          // FIXME: Do it better
          const dumpReviewers = await User.find({
            relations: ["usersApplications"],
            order: {
              createdAt: "ASC",
            },
            where: {
              role: UserType.REVIEWER,
              usersApplications: {
                role: RoleType.REVIEWER,
                orderBy: {
                  createdAt: "DESC",
                },
                take: 1,
              },
            },
          });

          if (!dumpReviewers) throw new NotFoundError();

          const unassignedReviewers = dumpReviewers.filter(
            (reviewer) => reviewer.usersApplications.length === 0
          );

          if (unassignedReviewers.length > 0) {
            res.json({
              status: 200,
              message: "Successfully fetched reviewers",
              data: unassignedReviewers[0],
            });
          } else {
            const oldestReviewers = dumpReviewers.filter(
              (reviewer) => reviewer.usersApplications.length > 0
            );

            const oldestReviewer = oldestReviewers.sort(
              (a, b) =>
                a.usersApplications[0].createdAt.getTime() -
                b.usersApplications[0].createdAt.getTime()
            )[0];

            res.json({
              status: 200,
              message: "Successfully fetched reviewers",
              data: oldestReviewer,
            });
          }

          break;
        }
        default:
          res.json({
            status: 200,
            message: "Successfully fetched reviewers",
            data: reviewers,
          });
      }
    } catch (err) {
      next(err);
    }
  }
);

export default userRouter;
