import express from "express";
import Application from "../models/application";
import formidable from "formidable"


const submitRouter = express.Router();



submitRouter.post("/submit", (req, res) => {
    let application_id = "1";
    let incrementer = -1
    const form = formidable({
        keepExtensions: true,
        uploadDir: "./data/pdf_store",
        filename: (name: string, ext: string, part: string, form: string)=>{
            incrementer++
            return application_id + "-" + incrementer + ext
        }
    })
    console.log(form)
    form.parse(req, (err, fields, files) => {
        console.log("form.")
        console.log(fields, files)
    })
    res.sendStatus(201)
})

export default submitRouter