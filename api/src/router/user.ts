import express from "express";
import User from "../models/user";
import Response, { sample_401_res, sample_404_res } from "../utils/response";

const userRouter = express.Router();

userRouter.get("/:id", async (req, res) => {
  let user = await User.getById(parseInt(req.params.id))
  if (!user){
    return res.status(404).json(sample_404_res);
  }
  if (req.user != user || req.user.role != "COORDINATOR"){
    return res.status(401).json(sample_401_res);
  }
  res.json(await User.getById(parseInt(req.params.id)));
});

userRouter.get("/", (req, res) => {
  res.send(req.user);
});

userRouter.patch("/", (req, res) => {
  let user = req.user;
  if (req.body.name){
    user.name = req.body.name;
  }

  if (req.body.bio){
    user.bio = req.body.bio;
  }

  if (req.body.name){
    user.school = req.body.school;
  }

  if (req.body.role){
    user.role = req.body.role;
  }

  user.save();
  res.sendStatus(200);
});

export default userRouter;
