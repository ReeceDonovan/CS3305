import express from "express";

import userRouter from "./router/user";
import loginRouter from "./router/login";
import pageRouter from "./router/landingPage";

const PORT = 8000;

const app = express();

app.use(userRouter);
app.use(loginRouter);
app.use(pageRouter);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
