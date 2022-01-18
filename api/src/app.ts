import express, { Router } from "express";

import userRouter from "./router/user";
import loginRouter from "./router/login";

const PORT = 8000;

const app = express();

app.use(userRouter);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
