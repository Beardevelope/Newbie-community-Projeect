import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';

config();

export default registerAs('mailer', () => ({
    smtp: 'smtp.gmail.com',
    smtp_id: process.env.GOOGLE_APP_EMAIL,
    smtp_pw: process.env.GOOGLE_APP_PASSWORD,
    smtp_ssl: true,
    smtp_port: 587,
    smtp_from_name: '<본인인증맨>',
    smtp_from_email: 'mck84835182@gmail.com',
    privkey: 'supertest',
}));
