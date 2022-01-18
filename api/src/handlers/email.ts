import * as nodemailer from 'nodemailer'
import config from '../config/config'

const cfg = new config()

export default function handler(recepient: string, subject: string, body: string) {
    const emailProvider = cfg.get().emailConfigs[cfg.get().emailType]
    const transportPayload = Object.assign(emailProvider, {user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS})
    const transporter = nodemailer.createTransport(transportPayload)
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recepient,
        subject: subject,
        text: body
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error(`Failed to send email: ${err}\nDetails: ${mailOptions}\nInfo: ${info}`)
    })
}