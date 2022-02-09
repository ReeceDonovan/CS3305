import * as nodemailer from "nodemailer";
import { stringify } from "querystring";

import config from "../config/config";

const providerKey: { [key: string]: number } = {
  gmail: 0,
  outlook: 1,
};

export default function handler(
  recepient: string,
  subject: string,
  body: string
) {
  const emailProvider =
    config.get().emailConfigs[providerKey[config.get().emailProvider]];

  const transportPayload = Object.assign(emailProvider, {
    user: config.get().emailUser,
    pass: config.get().emailToken,
  });
  const transporter = nodemailer.createTransport(transportPayload);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recepient,
    subject: subject,
    text: body,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err)
      console.log(
        `Failed to send email: ${err.message} ${JSON.stringify(
          err
        )}\nDetails: ${stringify(mailOptions)}\nInfo: ${JSON.stringify(info)}`
      );
  });
}
