// FIXME
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

import { BadRequestError, NotAuthorizedError, NotFoundError } from "../errors";
import { protectedRoute } from "../middleware/protected-route";
import reqUser from "../middleware/store-user";
import User, { UserType } from "../models/user";
import { RoleType } from "../models/usersApplications";

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user provided by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *
 *     responses:
 *       401:
 *         description: Unauthorized
 *       200:
 *         description: Successfully fetched user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
const getUser = async (
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
};

/**
 *
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get current logged-in user
 *     responses:
 *       401:
 *         description: Unauthorized
 *       200:
 *         description: Successfully fetched user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
const getCurrentUser = async (
  _: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const user = res.locals.user;

  try{
    const user_big = await User.findOne({
      where: { id: user.id}, 
      relations: [
        "reviews", 
        "usersApplications", 
        "usersApplications.application"]
      });
  
    res.json({
      status: 200,
      message: "Successfully fetched user",
      data: user_big,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           required: true
 *           $ref: '#/components/schemas/User'
 *
 *
 *     responses:
 *       401:
 *         description: Unauthorized
 *       200:
 *         description: Successfully updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
const updateUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const user = res.locals.user;
  const body: QueryDeepPartialEntity<User> = req.body;

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
};

/**
 * @swagger
 * /api/users/reviewers:
 *   get:
 *     tags: [Users]
 *     summary: Get reviewers
 *
 *     responses:
 *       401:
 *         description: Unauthorized
 *       403:
 *        description: Forbidden from accessing resource
 *       200:
 *         description: Successfully fetched reviewers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
const getReviewers = async (
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
      relations: ["usersApplications", "usersApplications.application"],
    });

    if (!reviewers) throw new NotFoundError();

    switch (target) {
      case "suggest": {
        const sortedReviewers = reviewers.sort((a, b) => {
          if (!a.usersApplications && !b.usersApplications) return 0;
          if (!a.usersApplications) return -1;
          if (!b.usersApplications) return 1;

          const aApplications = a.usersApplications.filter(
            (ua) => ua.role === RoleType.REVIEWER
          );
          const bApplications = b.usersApplications.filter(
            (ua) => ua.role === RoleType.REVIEWER
          );

          if (!aApplications && !bApplications) return 0;
          if (!aApplications || aApplications.length == 0) return -1;
          if (!bApplications || bApplications.length == 0) return 1;

          if (
            aApplications[aApplications.length - 1].createdAt <
            bApplications[bApplications.length - 1].createdAt
          )
            return -1;
          if (
            aApplications[aApplications.length - 1].createdAt >
            bApplications[bApplications.length - 1].createdAt
          )
            return 1;
          return 0;
        });

        res.json({
          status: 200,
          message: "Successfully fetched reviewers",
          data: sortedReviewers.slice(0, 3),
        });

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
};

/**
 * @swagger
 * /api/users/permissions:
 *   get:
 *     tags: [Users]
 *     summary: Get users
 *
 *     responses:
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden from accessing resource
 *       200:
 *         description: Successfully fetched users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
const getUsersPermissions = async (
  _: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const users = await User.find();
    res.json({
      status: 200,
      message: "Successfully fetched users",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/users/permissions:
 *   patch:
 *     tags: [Users]
 *     summary: Get user provided by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *
 *     responses:
 *       401:
 *         description: Unauthorized
 *       200:
 *         description: Successfully fetched user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPermission'
 */
const changeUserPermission = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const user = res.locals.user;

  interface PermissionRequest {
    id: number;
    role: UserType;
  }

  try {
    if (user.role !== UserType.COORDINATOR) throw new NotAuthorizedError();

    const { id, role } = req.body as PermissionRequest;

    if (!id || !role) throw new BadRequestError("Missing fields in request");

    const userToChange = await User.findOne(id);

    if (!userToChange) throw new NotFoundError();

    userToChange.role = role;

    await userToChange.save();

    res.json({
      status: 200,
      message: "Successfully changed user permission",
    });
  } catch (err) {
    next(err);
  }
};

const userRouter = express.Router();
userRouter.use(protectedRoute);

userRouter.get("/permissions", reqUser, getUsersPermissions);
userRouter.patch("/permissions", reqUser, changeUserPermission);
userRouter.get("/reviewers", reqUser, getReviewers);
userRouter.get("/:id", reqUser, getUser);
userRouter.get("/", reqUser, getCurrentUser);
userRouter.patch("/", reqUser, updateUser);

export default userRouter;
