import * as nodemailer from 'nodemailer'
import config from '../config/config'

const cfg = new config()

export default function handler() {
    nodemailer.createTransport()
}