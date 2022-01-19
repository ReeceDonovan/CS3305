import express from "express";
import cors from "cors";

import userRouter from "./router/user";
import loginRouter from "./router/login";
import pageRouter from "./router/landingPage";
import submitRouter from "./router/submit_form";

const PORT = 8000;

const app = express();

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//use cors as a handler before being added to your router, e.g.
// app.use(cors(corsOptions), submitRouter)

app.use(userRouter);
app.use(loginRouter);
app.use(pageRouter);


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
