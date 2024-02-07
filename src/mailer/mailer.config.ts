import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';

config();

export default registerAs('mailer', () => ({
    smtp: 'smtp.gmail.com',
    smtp_id: process.env.GOOGLE_APP_EMAIL,
    smtp_pw: process.env.GOOGLE_APP_PASSWORD,
    smtp_ssl: true,
    smtp_port: 587,
    smtp_from_name: '<example_name>',
    smtp_from_email: '<example>@gmail.com',
    privkey: 'supertest',
}));
