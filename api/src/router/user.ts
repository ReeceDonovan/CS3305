import express from "express";
import User from "../models/user";

import { sessions } from "./login";

const userRouter = express.Router();

userRouter.get("/users/:id", async (req, res) => {
  res.json(await User.getById(parseInt(req.params.id)));
});

userRouter.get("/users", (req, res) => {
  res.send(res.locals.user);
});

userRouter.post("/users", (req, res) => {
  let user = res.locals.user;
  if(req.body.name){
    user.name=req.body.name
  }if(req.body.bio){
    user.bio=req.body.bio
  }if(req.body.name){
    user.school=req.body.school
  }
  user.save()
  res.sendStatus(200);
})


export default userRouter;
