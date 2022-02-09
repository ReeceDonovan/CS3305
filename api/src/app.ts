import cors from "cors";
import express, { Express } from "express";

import { authUser } from "./middleware/auth-user";
import { errorHandler } from "./middleware/error-handler";
import { createConn } from "./models/database";
import appRouter from "./router/application";
import aboutRouter from "./router/landingPage";
import loginRouter from "./router/login";
import reviewRouter from "./router/reviews";
import settingsRouter from "./router/settings";
import userRouter from "./router/user";

const PORT = 8000;

const createApp = (): Express => {
  const app = express();
  const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  app.use(cors(corsOptions));
  app.use(express.json());

  app.use(authUser);

  app.use("/login", loginRouter);
  app.use("/about", aboutRouter);
  app.use("/admin", settingsRouter);

  app.use("/users", userRouter);
  app.use("/applications", appRouter);
  app.use("/reviews", reviewRouter);

  app.use(errorHandler);

  return app;
};

const start = () => {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);

    try {
      createConn().catch((err) => {
        console.log(err);
      });
      console.log("Database connected");
    } catch (error) {
      console.log("Error connecting to database");
      console.log(error);
    }
  });

  process.on("SIGINT", () => shutdown());
  process.on("SIGTERM", () => shutdown());

  const shutdown = () => {
    console.log("Shutting down server");
    process.exit(0);
  };
};

start();
