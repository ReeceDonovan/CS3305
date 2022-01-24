import express from "express";
import User from "../models/user";

const userRouter = express.Router();

userRouter.get("/users/:id", async (req, res) => {
  res.json(await User.getById(parseInt(req.params.id)));
});

userRouter.get("/users", (req, res) => {
  res.send(req.user);
});

userRouter.patch("/users", (req, res) => {
  let user = req.user;
  if (req.body.name){
    user.name = req.body.name
  }

  if (req.body.bio){
    user.bio = req.body.bio
  }

  if (req.body.name){
    user.school = req.body.school
  }

  user.save()
  res.sendStatus(200);
})

export default userRouter;
