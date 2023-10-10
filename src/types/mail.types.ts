import {Email, Token} from "./";

export type SendActivationMailParams = {
  email: Email;
  confirmationToken: Token;
}
export type SendResetPasswordMailParams = SendActivationMailParams;