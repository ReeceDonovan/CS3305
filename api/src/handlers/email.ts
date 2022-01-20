import * as nodemailer from "nodemailer";

import config from "../config/config";

enum providers {
  "gmail" = 0,
  "outlook" = 1,
}

export default function handler(
  recepient: string,
  subject: string,
  body: string
) {
  const emailProvider =
    config.get().emailConfigs[providers[config.get().emailProvider]];
  const transportPayload = Object.assign(emailProvider, {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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
      console.error(
        `Failed to send email: ${err}\nDetails: ${mailOptions}\nInfo: ${info}`
      );
  });
}
