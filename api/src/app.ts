import express from "express";
import cors from "cors";

import { createConn } from "./models/database";
import pageRouter from "./router/landingPage";
import loginRouter from "./router/login";
import userRouter from "./router/user";
import appRouter from "./router/application";

const PORT = 8000;

createConn();

const app = express();

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// use cors as a handler before being added to your router, e.g.
app.use(cors(corsOptions));

app.use(userRouter);
app.use(loginRouter);
app.use(pageRouter);
app.use('/applications', appRouter)


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

