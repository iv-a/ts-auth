import {Types} from "mongoose";
import {USER} from "../constants/";
import {Token} from "./token.types";
import {ClientDetails} from "./";

export type FirstName = string;
export type LastName = string;
export type Email = string;
export type Password = string;
export type Status = USER.STATUS;
export type UserId = Types.ObjectId;

export type UserSchema = {
  firstName: FirstName;
  lastName: LastName;
  email: Email;
  password: Password;
  status: Status;
}

export type CreateUserParams = Omit<UserSchema, "status">;
export type ChangeUserPasswordParams = {
  token: Token;
  newPassword: Password;
} & ClientDetails;
export type ActivateAccountParams = {
  token: Token;
} & ClientDetails;