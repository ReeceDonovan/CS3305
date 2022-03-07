import cors from "cors";
import express, { Express } from "express";

import { authUser } from "./middleware/auth-user";
import { errorHandler } from "./middleware/error-handler";
import { createConn } from "./models/database";
import appRouter from "./router/application";
import aboutRouter from "./router/landingPage";
import loginRouter from "./router/login";
import reviewRouter from "./router/reviews";
import userRouter from "./router/user";
import adminRouter from "./router/admin";

import { setup, serveWithOptions } from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const PORT = 8000;

// TODO - Privacy Policy & Licence
// Extended : https://swagger.io/specification/#infoObject
const SWAGGER_OPTIONS = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "SREC API",
      description:
        "API for the SREC website to upload and have research ethically reviewed",
      contact: {
        name: "CS3305 Team 1",
        email: "119429402@umail.ucc.ie",
        url: "https://github.com/reecedonovan/cs3305",
      },
      license: {
        name: "MIT",
        url: "TODO: URL",
      },
      version: "1.0.0",
      servers: [
        {
          description: "Local Development Server",
          url: "http://localhost/api",
        },
        {
          description: "Production Server",
          url: "https://srec.netsoc.cloud/api",
        },
      ],
    },
  },
  apis: ["./src/router/*.ts", "app.ts"],
};

const swaggerDocs = swaggerJSDoc(SWAGGER_OPTIONS);

const createApp = (): Express => {
  const app = express();
  const corsOptions = {
    origin: "http://localhost:3000", // TODO: update this to use config url
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  app.use(cors(corsOptions));
  app.use(express.json());

  app.use("/docs", serveWithOptions({ redirect: false }), setup(swaggerDocs));

  app.use(authUser);

  app.use("/login", loginRouter);
  app.use("/about", aboutRouter);
  app.use("/admin", adminRouter);

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
