import express from "express";

import userRouter from "./router/user";
import loginRouter from "./router/login";
import { Config } from "./config/config";

const PORT = 8000;

const app = express();

new Config();

app.use(userRouter);
app.use(loginRouter);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
