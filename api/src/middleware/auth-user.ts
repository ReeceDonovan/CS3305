import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import config from "../config/config";
import { NotAuthorizedError } from "../errors";
import { UserType } from "../models/user";

export interface UserClaims {
  id: number;
  role: UserType;
  email: string;
  name?: string;
  bio?: string;
  school?: string;
  avatar?: string;
}

export interface TokenClaims {
  user: UserClaims;
  exp: number;
  iat: number;
}

// For appending a user to Express Request
declare module "express" {
  export interface Request {
    user?: UserClaims;
  }
}

export const authUser = (req: Request, _: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    console.log("No token found in Auth Header: ", new NotAuthorizedError());
    return next();
  }
  try {
    const decoded = jwt.verify(token, config.get().signingKey) as TokenClaims;
    req.user = decoded.user;
  } catch (err) {
    console.log("Error in decoding token: ", err);
  }
  next();
};
