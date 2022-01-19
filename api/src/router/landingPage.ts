/**
 * Temporary file, until there is a better place to put this
 */
import express from "express";
import config from '../config/config'
import showdown from 'showdown'
import DOMPurify from 'isomorphic-dompurify';

const pageRouter = express.Router();

pageRouter.get("/about", (req, res) => {
    const converter = new showdown.Converter();
    res.set('Content-Type', 'text/html');
    res.send(DOMPurify.sanitize(converter.makeHtml(config.get().landingPageMD)));
})

export default pageRouter
