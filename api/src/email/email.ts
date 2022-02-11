import { google } from "googleapis";
import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import config from "../config/config";
import { ExtendedTransporter } from "./customTransport";

const transportProvider = async (): Promise<ExtendedTransporter> => {
  let transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  switch (config.get().emailConfig.provider) {
    case "gmail":
      if (config.get().emailConfig.lessSecure) {
        transport = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            type: "LOGIN",
            user: config.get().emailConfig.user,
            pass: config.get().emailConfig.token,
          }
        });
      } else {
        const client = new google.auth.OAuth2(config.get().emailConfig.user, config.get().emailConfig.token);
        client.setCredentials({refresh_token: config.get().emailConfig.refreshToken});
        transport = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
              type: "OAUTH2",
              user: config.get().emailConfig.user,
              clientId: config.get().emailConfig.clientId,
              clientSecret: config.get().emailConfig.token,
              refreshToken: config.get().emailConfig.refreshToken,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              accessToken: (await client.getAccessToken()).token!
          }
        });
      }
      break;
  
    case "outlook":
      transport = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        secure: false,
        port: 587,
        tls: {
          ciphers: "SSLv3",
        },
        auth: {
          user: config.get().emailConfig.user,
          pass: config.get().emailConfig.token
        }
      });
      break;
    case "zoho":
      transport = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true, 
        auth: {
          user: config.get().emailConfig.user,
          pass: config.get().emailConfig.token
        }
      });
      break;
    case "ethereal": // Testing Mail
      transport = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: config.get().emailConfig.user,
          pass: config.get().emailConfig.token
        },
      });
      break;
    default:
      transport = nodemailer.createTransport(
        {
          host: config.get().emailConfig.host,
          port: config.get().emailConfig.port,
          secure: config.get().emailConfig.secure,
          auth: {
            user: config.get().emailConfig.user,
            pass: config.get().emailConfig.token
          }
        }
      );
      break;
  }

  return new ExtendedTransporter(transport);
};

export default transportProvider;