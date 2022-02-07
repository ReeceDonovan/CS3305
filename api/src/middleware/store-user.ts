import { NextFunction, Request, Response } from 'express';
import { NotAuthorizedError } from '../errors';

import User from '../models/user';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.user?.id;

    const user = await User.findOne({ id: userID });

    res.locals.user = user;

    return next();
  } catch (err) {
    console.log(err);
    return next(new NotAuthorizedError());
  }
};