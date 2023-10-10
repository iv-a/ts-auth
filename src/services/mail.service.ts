import nodemailer from "nodemailer";
import {BASE_URL, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER} from "../configs";
import {SendActivationMailParams, SendResetPasswordMailParams} from '../types';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  }
});

export const sendActivationMail = async ({ email, confirmationToken }: SendActivationMailParams) => {
  await transporter.sendMail({
    from: SMTP_USER,
    to: email,
    subject: "Активация аккаунта",
    text: `Для завершения регистрации перейдите по ссылке: ${BASE_URL}/account/activate/${confirmationToken}`,
    html: `<h1>Email Confirmation</h1>
        <h2>Hello</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${BASE_URL}/account/activate/${confirmationToken}> Click here</a>
        </div>`,
  });
};

export const sendResetPasswordMail = async ({ email, confirmationToken }: SendResetPasswordMailParams) => {
  await transporter.sendMail({
    from: SMTP_USER,
    to: email,
    subject: "Смена пароля",
    text: `Для смены пароля перейдите по ссылке: ${BASE_URL}/account/change-password/${confirmationToken}`,
    html: `<h1>Email Confirmation</h1>
        <h2>Hello</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${BASE_URL}/account/activate/${confirmationToken}> Click here</a>
        </div>`,
  });
};