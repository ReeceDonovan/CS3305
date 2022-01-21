import express from "express";

import { createConn } from "./models/database";
import pageRouter from "./router/landingPage";
import loginRouter from "./router/login";
import userRouter from "./router/user";

const PORT = 8000;

createConn();

const app = express();

app.use(userRouter);
app.use(loginRouter);
app.use(pageRouter);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
