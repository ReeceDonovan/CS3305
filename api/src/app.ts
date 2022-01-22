import express from "express";

import { createConn } from "./models/database";
import { decodeToken } from "./auth/tokens";

import pageRouter from "./router/landingPage";
import loginRouter from "./router/login";
import userRouter from "./router/user";
import User from "./models/user";
import response from "./utils/response";

const PORT = 8000;

createConn();

const app = express();

app.use(userRouter);
app.use(loginRouter);
app.use(pageRouter);

const unAuthenticatedRoutes: string[] = ["/login", "/login/callback", "/about"];

// middleware to check for Authorization header, to get token.
// gets user from id in token, then sends user object to next handler
app.use(async (req: express.Request, res: express.Response, next) => {

  // if authorization is not necessary for a route, skip this middleware
  if (req.url in unAuthenticatedRoutes) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.split(" ")[0] == "Bearer" && authHeader.split(" ")[1]) {
    const token = await decodeToken(authHeader.split(" ")[1]);
    if (token !== null) {
      const user = await User.getById(token.userID);
      res.locals.user = user;
      return next();
    }
  }
  
  const unauthorizedResponse: response = {
    data: null,
    message: "Unauthorized",
    status: 401,
  }

  return res.status(401).json(unauthorizedResponse);
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
