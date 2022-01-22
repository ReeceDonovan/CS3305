import express from "express";
import User from "../models/user";

import { sessions } from "./login";

const userRouter = express.Router();

userRouter.get("/users/:id", async (req, res) => {
  res.json(await User.getById(parseInt(req.params.id)));
});

userRouter.get("/users", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const tokenData = sessions[token];
  if (tokenData === undefined) {
    res.status(401).send("Unauthorized");
  }
  res.send(User.getByEmail(tokenData.email));
});

export default userRouter;
