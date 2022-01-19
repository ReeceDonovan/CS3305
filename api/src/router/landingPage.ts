/**
 * Temporary file, until there is a better place to put this
 */
import express from "express";
import Config from '../config/config'

const pageRouter = express.Router();

pageRouter.get("/about", (req, res) => {
    var curConfig = new Config()
    res.send(curConfig.get().landingPageMD)
})

export default pageRouter
