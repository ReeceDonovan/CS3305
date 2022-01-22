import express from "express";

import User from "../models/user";

const userRouter = express.Router();

userRouter.get("/users/:id", async (req, res) => {
  res.json(await User.getById(parseInt(req.params.id)));
});

export default userRouter;
