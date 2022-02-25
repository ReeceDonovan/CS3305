import { NextFunction, Request, Response, Router } from "express";
import { DeepPartial, getRepository, Repository } from "typeorm";

import { NotAuthorizedError, NotFoundError } from "../errors";
import { protectedRoute } from "../middleware/protected-route";
import reqUser from "../middleware/store-user";
import Application from "../models/application";
import Review from "../models/review";
import User, { UserType } from "../models/user";
import UsersApplications from "../models/usersApplications";

const checkAccess = async (
  application: Application,
  user: User
): Promise<boolean> => {
  if (user.role === UserType.RESEARCHER) {
    return false;
  }

  if (user.role === UserType.COORDINATOR) {
    return true;
  }

  const userApplicationRepo: Repository<UsersApplications> =
    getRepository(UsersApplications);

  const userApplication = await userApplicationRepo.findOne({
    where: {
      application,
      user,
      role: UserType.REVIEWER,
    },
  });

  return userApplication !== undefined;
};

const getReview = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  const review_id = req.params.id;

  try {
    const review = await Review.findOne(review_id, {
      relations: ["application", "user"],
    });

    if (!review) throw new NotFoundError();

    if (!(await checkAccess(review.application, user)))
      throw new NotAuthorizedError();

    res.json({
      status: 200,
      message: "Successfully retrieved review",
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

// TODO: Needs testing from this endpoint down
const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;
  const review_id = req.params.id;

  try {
    const review = await Review.findOne(review_id, {
      relations: ["application", "user"],
    });

    if (!review) throw new NotFoundError();

    if (!(await checkAccess(review.application, user)))
      throw new NotAuthorizedError();

    const updatedReview = Review.merge(review, req.body as DeepPartial<Review>);

    await updatedReview.save();

    res.json({
      status: 200,
      message: "Successfully updated review",
      data: updatedReview,
    });
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;
  const review_id = req.params.id;

  try {
    const review = await Review.findOne(review_id, {
      relations: ["application", "user"],
    });

    if (!review) throw new NotFoundError();

    if (!(await checkAccess(review.application, user)))
      throw new NotAuthorizedError();

    await review.remove();

    res.json({
      status: 200,
      message: "Successfully deleted review",
    });
  } catch (err) {
    next(err);
  }
};

const reviewRouter = Router();
reviewRouter.use(protectedRoute);

reviewRouter.get("/:id", reqUser, getReview);
reviewRouter.patch("/:id", reqUser, updateReview);
reviewRouter.delete("/:id", reqUser, deleteReview);

export default reviewRouter;
