/**
 * Temporary file, until there is a better place to put this
 */
import express from "express";
import DOMPurify from "isomorphic-dompurify";
import showdown from "showdown";

import config from "../config/config";

const aboutRouter = express.Router();

aboutRouter.get("/", (_req, res) => {
  const converter = new showdown.Converter();
  res.set("Content-Type", "text/html");
  res.send(DOMPurify.sanitize(converter.makeHtml(config.get().landingPageMD)));
});

export default aboutRouter;
