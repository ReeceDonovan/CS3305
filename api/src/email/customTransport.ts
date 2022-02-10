/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Transport, TransportOptions } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

interface boilerplateOptions {
  title?: string;
}

export class MailTransportWithRespones extends Mail {
  constructor(transporter: Transport<any>, options?: TransportOptions | undefined, defaults?: TransportOptions | undefined) {
    super(transporter, options, defaults);
  }

  // TODO: Make nice CSS for the HTML template, to give a feel for a refined product, use inline CSS, and make advantage of HTML tags, we may expand this to also be able to use and take a company logo etc.
  private boilerplateMessage(mailOptions: Mail.Options, callback: (err: Error | null, info: any) => void, options: boilerplateOptions) {
    super.sendMail({
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: `${mailOptions.text}\n\nThis is an automated email, please do not reply back to this. If an issue arises contact your local system administrator, or co-ordinator.`,
      html: `
      <table>
        <tr>
          <td><h1>${options.title}</h1></td>
        </tr>
        <tr>
          <td>
          ${mailOptions.html}
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <span style="display:block"> 
              <img src="OrgLogo" width="100" height="40"> 
              <br> 
              This is an automated email, please do not reply back to this. If an issue arises contact your local system administrator, or co-ordinator.
            </span>
          </td>
          <td></td>
        </tr>
      </table>`
    }, callback);
  }

  public updateNotification(mailOptions: Mail.Options, callback: (err: Error | null, info: any) => void) {
    this.boilerplateMessage({...mailOptions, text: "One of your applications had an update! Please check at the link below to get full information on this", html: "<p>One of your applications had an update! Please check at the link below to get full information on this</p>"}, callback, {title: "We have an update!"})
  }
}
