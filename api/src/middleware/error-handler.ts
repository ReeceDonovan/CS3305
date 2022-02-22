import { NextFunction, Request, Response } from "express";

import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.serializeErrors(),
    });
  }

  res.status(400).json({
    status: 400,
    message: "Something went wrong",
  });
   
  next(err);
};
