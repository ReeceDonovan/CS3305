import express from "express";
import cors from "cors";

import { createConn } from "./models/database";
import { decodeToken } from "./auth/tokens";

import loginRouter from "./router/login";
import settingsRouter from "./router/settings";
import userRouter from "./router/user";
import User from "./models/user";
import response, { sample_401_res } from "./utils/response";
import appRouter from "./router/application";
import aboutRouter from "./router/landingPage";
import reviewRouter from "./router/reviews";

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

const unAuthenticatedRoutes: string[] = ["/login", "/login/callback", "/about"];

//allow lists for the first level rba mechanism, they must have the route in the list to be allowed to visit
const researcher_routes = ["", "applications", "users"];
const reviewer_routes = ["", "applications", "users", "reviews"];
const admin_routes = ["", "applications", "users", "admin", "reviews"];

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

// middleware to check for Authorization header, to get token.
// gets user from id in token, then sends user object to next handler
app.use(async (req: express.Request, res: express.Response, next) => {
  // log request
  console.log(
    `${new Date().getTime()} ${req.method.toUpperCase()} ${req.url} `
  );

  // if authorization is not necessary for a route, skip this middleware
  if (unAuthenticatedRoutes.includes(req.url.split("?")[0])) {
    console.log("skipping auth");
    return next();
  }

  const authHeader = req.headers.authorization;

  if (
    authHeader &&
    authHeader.split(" ")[0] == "Bearer" &&
    authHeader.split(" ")[1]
  ) {
    const token = await decodeToken(authHeader.split(" ")[1]);
    if (token !== null) {
      const user = await User.getByEmail(token.user.email);
      req.user = user;
      
      // general sec
      const path = req.url.split("?")[0];
      const top_path = path.split("/")[1];
      
      // filters users and gives rejecctions if they try to acess top level path which no  permissions based on above allow lists
      if (user.role === "RESEARCHER" && researcher_routes.includes(top_path)) {
        return next();
      } else if (user.role === "REVIEWER" && reviewer_routes.includes(top_path)) {
        return next();
      } else if (user.role === "COORDINATOR" && admin_routes.includes(top_path)) {
        return next();
      } else {
        return res.status(401).json(sample_401_res);
      }
      
    }
  }
  return res.status(401).json(sample_401_res);
});

app.use("/login", loginRouter);
app.use("/about", aboutRouter);
app.use("/admin", settingsRouter);

app.use("/users", userRouter);
app.use("/applications", appRouter);
app.use("/reviews", reviewRouter);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
