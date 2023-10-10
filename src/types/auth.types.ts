import {ClientDetails, CreateUserParams, Email, Password, Token, UserId} from "./";

export type SignUpParams = CreateUserParams & ClientDetails;
export type SignInParams = Omit<SignUpParams, "firstName" | "lastName">;
export type SignOutParams = {
  token: Token
} & ClientDetails;

export type RefreshAuthParams = SignOutParams;
export type ChangePasswordParams = {
  userId: UserId;
  prevPassword: Password;
} & ClientDetails;
export type ResetPasswordParams = {
  email: Email;
} & ClientDetails;