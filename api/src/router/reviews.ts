// @format
import express from "express";
import Application from "../models/application";
import Review, { ReviewStatus } from "../models/review";
import User from "../models/user";
import Response from "../utils/response";


const reviewRouter = express.Router();

const check_access = (application: Application, user: User) => {
  return application.reviewers.includes(user) || user.role === "COORDINATOR"
}

reviewRouter.get(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    const application = await Application.getById(parseInt(req.params.id), []);
    
    if (!application || check_access(application, req.user)) {
      res.status(404).send("Application not found");
      return;
    }

    if (application.reviews) {
      const response: Response = {
        status: 200,
        data: application.reviews,
        message: "Success",
      };
      res.json(response);
    } else {
      res.status(404).send("No reviews found");
    }
  }
);

reviewRouter.post(
  "/:id",
  async (req: express.Request, res: express.Response) => {
    const application = await Application.getById(parseInt(req.params.id), [
      "reviews",
    ]);

    if (!application || check_access(application, req.user)) {
      res.status(404).send("Application not found");
      return;
    }

    const review = new Review({
      reviewer: req.user,
      status: req.body.status ? req.body.status : ReviewStatus.PENDING,
      comment: req.body.comment ? req.body.comment : null,
      application: application,
    });

    // application.reviews
    //   ? application.reviews.push(review)
    //   : (application.reviews = [review]);
    // application.save();

    application.addReview(review);

    const response: Response = {
      status: 201,
      message: "Success",
      data: review,
    };
    res.json(response);
  }
);

export default reviewRouter;
