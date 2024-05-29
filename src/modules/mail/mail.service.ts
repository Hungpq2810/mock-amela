import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import dotenv from 'dotenv';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const info = await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: to,
      subject: subject,
      text: text,
    });

    console.log('Message sent: %s', info.messageId);
  }

  async sendResetPasswordEmail(to: string, token: string) {
    await this.sendMail(
      to,
      'Reset your password (valid for 10 minutes)',
      `Click here to reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${token}`,
    );
  }
}
