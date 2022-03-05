import { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import config from "../config/config";

interface boilerplateOptions {
  title?: string;
}

/**
 * Delegated Class used to create boilerplated email messages, you can access the original transport through object notation
 */
export class ExtendedTransporter {
  transporter: Transporter;
  constructor(transporter: Transporter) {
    this.transporter = transporter;
  }

  // Move this out cause it was causing a build failure
  /** Button to Link away reuse this pls
  <a style="min-width: 5rem;background: #222;padding: 1rem;max-width: 10rem;border-radius: 1rem;color: white;margin: 5rem;"></a> */
  // TODO: Make nice CSS for the HTML template, to give a feel for a refined product, use inline CSS, and make advantage of HTML tags, we may expand this to also be able to use and take a company logo etc.
  private boilerplateMessage(mailOptions: Mail.Options, callback: (err: Error | null, info: any) => void, options: boilerplateOptions) {
    this.transporter.sendMail({
      from: config.get().emailConfig.user,
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: `${options.title}\n${mailOptions.text}\n\nThis is an automated email, please do not reply back to this. If an issue arises contact your coordinator.`,
      html: `
      <table style="background-color;background-color: #f0f0f0;font-family: monospace;">
        <tbody style="display: flex;width: 70%;margin: 0 auto 0 auto;">
          <tr>
            <td><h1 style="margin: 0.5rem;">${options.title}</h1></td>
          </tr>
          <tr style="min-height: 280px;">
            <td style="display: flex;align-items: center;flex-direction: column;width: 90%;margin: 0 auto 0 auto;">
            ${mailOptions.html}
            </td>
          </tr>
          <tr style="color: white;background: #222;">
            <td>
              <span style="display:flex;flex-direction: column;align-items: center;"> 
                <img src="${config.get().companyLogo}" style="margin: 1rem auto 2rem auto;max-width: 200;"> 
                <p style="width: 90%;">This is an automated email, please do not reply back to this. If an issue arises contact your coordinator @ srec@ucc.ie.</p>
              </span>
            </td>
          </tr>
        </tbody>
      </table>`
    }, callback);
  }

  public updateNotification(mailOptions: Mail.Options, callback: (err: Error | null, info: any) => void, updateString: string) {
    this.boilerplateMessage({
      ...mailOptions, 
      text: `Your applications is now ${updateString}! Please check at the link below to get full information on this`, 
      html: `<p>Your applications is now ${updateString}! Please check at the link below to get full information on this</p>`}, 
      callback, 
      {title: "We have an update!"});
  }
}
