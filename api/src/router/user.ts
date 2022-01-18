import express from "express";
import User from "../models/user";

const userRouter = express.Router();

userRouter.get("/users/:id", (req, res) => {
    var user = new User()
    user.id = parseInt(req.params.id)
    res.send(user.getFromId())
})

export default userRouter
