import axios from "axios";
import express from "express";

import config from '../config/config'
import User from "../models/user";

import jwt from 'jsonwebtoken'

const loginRouter = express.Router();
import response from '../utils/response'

// sessions map of string to object with date and string
const sessions: { [key: string]: { date: number, email: string } } = {};

loginRouter.get(
  "/login",
  async (_req: express.Request, res: express.Response) => {
    res.redirect(
      `https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/userinfo.email&hd=ucc.ie&client_id=${config.get().oauthConfig.oauthClientId}&redirect_uri=http://localhost:8000/login/callback&response_type=code`
    );
  }
);

loginRouter.get(
  "/login/callback",
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

    if (resp.data.email.endsWith("ucc.ie") && resp.data.verified_email === true) {
      const email = resp.data.email;
      const avatar = resp.data.picture;

      const user = new User();
      user.email = email;
      user.getFromEmail();

      // if user has not been created yet...
      if (user.id === 0) {
        if (User.create(email, avatar).id != 0) {
          res.status(501).send("Error creating user");
        }
      }

      // create and sign a jwt 
      var sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const token = jwt.sign({
        id: sessionId,
        email: email
      }, config.get().signingKey, (err: Error, token: string) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error signing token");
        }
        sessions[sessionId] = { date: new Date().setHours(new Date().getHours() + 24), email: email };
        const re: response = {
          status: 200,
          message: "Success",
          data: token
        }
        res.json(re)
      });
    }
  }
);

export default loginRouter;