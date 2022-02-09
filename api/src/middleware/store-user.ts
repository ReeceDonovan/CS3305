import { NextFunction, Request, Response } from "express";

import User from "../models/user";

interface Locals {
  user: User;
}

// For appending a user to Express Response Locals
declare module "express" {
  export interface Response {
    locals: Locals;
  }
}

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new Error("No user found");
    }
    const userID = req.user.id;

    User.findOne(userID)
      .then((user) => {
        if (!user) {
          throw new Error("No user found");
        }
        res.locals.user = user;
        return next();
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    return next(error);
  }
};
