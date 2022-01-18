import axios from "axios";
import express from "express";
import https from "https";

const loginRouter = express.Router();

loginRouter.get(
  "/login",
  async (_req: express.Request, res: express.Response) => {
    res.redirect(
      `https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/userinfo.email&hd=ucc.ie&client_id=<>&redirect_uri=http://localhost:8000/login/callback&response_type=code`
    );
  }
);

loginRouter.get(
  "/login/callback",
  async (req: express.Request, res: express.Response) => {
    const code = req.query["code"];

    const r = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id:
        "",
      client_secret: "",
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:8000/login/callback",
    });

    const access_token = r.data.access_token;
    const resp = await axios(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
    );
    console.log(resp.data);
    res.send(resp.data);
  }
);

export default loginRouter;
