// @format
import Review from './-models/review.ts';
import express from 'express';

const reviewRouter = express.Router();

reviewRouter.get("/:id", (req: express.Request, res: express.Response) => {
  const application = Application.findById(req.params.id, true);

  if (!application) {
    res.status(404).send("Application not found");
    return;
  }

  if (application.reviews) {
    res.json(application.reviews);
  } else {
    res.status(404).send("No reviews found");
  }
});

reviewRouter.post("/:id", (req: express.Request, res: express.Response) => {
  const application = Application.findById(req.params.id, true);

  if (!application) {
    res.status(404).send("Application not found");
    return;
  }

  const review = new Review({
    reviewer: req.user,
    status: (req.body.status) ? req.body.status : ReviewStatus.PENDING,
    comment: (req.body.comment) ? req.body.comment : null,
    application: application,
  });

  application.reviews.push(review);
  application.save();

  const response: Response = {
    status: "success",
    message: "Success",
    data: review,
  };
  
  res.status(201).send(review);
});

