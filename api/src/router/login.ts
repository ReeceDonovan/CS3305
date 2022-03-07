// FIXME: Fix the errors raised when these rules aren't disabled.
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from "axios";
import express from "express";
import jwt from "jsonwebtoken";

import config from "../config/config";
import { BadRequestError, InternalError } from "../errors";
import User from "../models/user";

const loginRouter = express.Router();

loginRouter.get("/", (_req: express.Request, res: express.Response) => {
  res.redirect(
    `https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/userinfo.email&client_id=${
      config.get().oauthConfig.oauthClientId
    }&redirect_uri=${config.get().apiURL}/login/callback&response_type=code`
  );
});

loginRouter.get(
  "/callback",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const code = req.query["code"];

    try {
      const r = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: config.get().oauthConfig.oauthClientId,
        client_secret: config.get().oauthConfig.oauthClientSecret,
        grant_type: "authorization_code",
        redirect_uri: `${config.get().apiURL}/login/callback`,
      });

      const access_token = r.data.access_token;
      const resp = await axios(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
      );

      const mailDomain = resp.data.email.split("@")[1];

      if (!config.get().oauthConfig.allowedDomains.includes(mailDomain)) {
        throw new BadRequestError(
          "Email not verified, or not from allowed domain"
        );
      }

      const email = resp.data.email;
      const avatar = resp.data.picture;

      let user = await User.findOne({ email });

      if (!user) {
        user = new User({ email, avatar });
        await user.save();
      }

      jwt.sign(
        {
          user,
          exp: Math.floor(Date.now() / 1000) + 6 * 60 * 60,
        },
        config.get().signingKey,
        (err: Error | null, token: string | undefined) => {
          if (err || !token) {
            throw new InternalError("Error signing token");
          } else {
            res.redirect(`${config.get().uiURL}/login?token=${token}`);
          }
        }
      );
    } catch (err) {
      next(err);
    }
  }
);

export default loginRouter;
