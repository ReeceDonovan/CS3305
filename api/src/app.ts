import express from "express";
import cors from "cors";

import { createConn } from "./models/database";
import { decodeToken } from "./auth/tokens";

import pageRouter from "./router/landingPage";
import loginRouter from "./router/login";
import userRouter from "./router/user";
import User from "./models/user";
import response from "./utils/response";
import appRouter from "./router/application";

const PORT = 8000;
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

createConn();

const app = express();

const unAuthenticatedRoutes: string[] = ["/login", "/login/callback", "/about", "/applications/13/form"];

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

app.use(express.json())

// middleware to check for Authorization header, to get token.
// gets user from id in token, then sends user object to next handler
app.use(async (req: express.Request, res: express.Response, next) => {

  // log request
  console.log(`${new Date().getTime()} ${req.method.toUpperCase()} ${req.url} `);

  // if authorization is not necessary for a route, skip this middleware
  if (unAuthenticatedRoutes.includes(req.url.split("?")[0])) {
    console.log("skipping auth");
    return next();
  }

  const authHeader = req.headers.authorization;

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

app.use(userRouter);
app.use(loginRouter);
app.use(pageRouter);
app.use('/applications', appRouter)



app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

