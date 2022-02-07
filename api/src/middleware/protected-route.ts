import { NextFunction, Request, Response } from "express";

import { NotAuthorizedError } from "../errors/not-authorized-error";

import { UserType } from "../models/user";

const permissionLevel = {
  [UserType.COORDINATOR]: 1,
  [UserType.REVIEWER]: 2,
  [UserType.RESEARCHER]: 3,
};

const reviewer_routes = ["/reviews", "/reviews/:reviewId"];
const coordinator_routes = ["/admin"];

export const protectedRoute = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new NotAuthorizedError();
  }

  const user = req.user;
  const permissions = permissionLevel[user.role];
  const route = req.path;

  if (coordinator_routes.includes(route) && permissions > 1) {
    throw new NotAuthorizedError();
  } else if (reviewer_routes.includes(route) && permissions > 2) {
    throw new NotAuthorizedError();
  }

  next();
};