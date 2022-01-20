import express from "express";
import User from "../models/user";

const userRouter = express.Router();

userRouter.get("/users/:id", (req, res) => {
  res.send(User.getById(parseInt(req.params.id)));
});

export default userRouter;
