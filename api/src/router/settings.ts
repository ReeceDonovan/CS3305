/**
 * Temporary file, until there is a better place to put this
 */
import express from "express";
import config, { configInterface } from "../config/config";

const settingsRouter = express.Router();

settingsRouter.get("/settings", (req, res) => {
  res.send(config.get());
});

settingsRouter.post("/settings", (req, res) => {
  const data: configInterface = req.body
  config.update(data)
  res.status(200)
  res.send()
});

export default settingsRouter;