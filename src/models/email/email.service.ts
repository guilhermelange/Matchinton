import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  async send(createEmailDto: CreateEmailDto) {
    const mailOptions = {
      from: 'Matchinton',
      to: createEmailDto.to,
      subject: createEmailDto.subject,
      html: createEmailDto.message,
    };

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail(mailOptions);
    return '';
  }
}
