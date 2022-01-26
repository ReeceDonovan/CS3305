import axios from "axios";
import express from "express";
import jwt from "jsonwebtoken";

import config from "../config/config";
import User from "../models/user";
import response from "../utils/response";

const loginRouter = express.Router();

loginRouter.get("/", async (_req: express.Request, res: express.Response) => {
  res.redirect(
    `https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/userinfo.email&client_id=${
      config.get().oauthConfig.oauthClientId
    }&redirect_uri=http://localhost:8000/login/callback&response_type=code`
  );
});

loginRouter.get(
  "/callback",
  async (req: express.Request, res: express.Response) => {
    const code = req.query["code"];

    const r = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: config.get().oauthConfig.oauthClientId,
      client_secret: config.get().oauthConfig.oauthClientSecret,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:8000/login/callback",
    });

    const access_token = r.data.access_token;
    const resp = await axios(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
    );

    const mailDomain = resp.data.email.split("@")[1];

    if (
      config.get().oauthConfig.allowedDomains.includes(mailDomain) &&
      resp.data.verified_email === true
    ) {
      const email = resp.data.email;
      const avatar = resp.data.picture;

      const user = await User.getByEmail(email);

      if (user === undefined) {
        const newUser = new User({
          email: email,
          avatar: avatar,
        });
        await newUser.save();
      }

      jwt.sign(
        {
          ...user,
          exp: Math.floor(Date.now() / 1000) + 6 * 60 * 60,
        },
        config.get().signingKey,
        (err: Error, token: string) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error signing token");
          }
          res.redirect(`http://localhost:3000/login?token=${token}`);
        }
      );
    }
  }
);

export default loginRouter;
