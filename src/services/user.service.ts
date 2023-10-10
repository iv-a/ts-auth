import {ActivateAccountParams, ChangeUserPasswordParams, CreateUserParams, Token} from "../types";
import {UserModel} from "../models";
import {Exception} from "../exceptions";
import bcrypt from "bcrypt";
import {SALT_ROUNDS} from "../configs";
import {TokenService} from ".";
import {TOKEN, USER} from "../constants";
import {REASON_FOR_REVOKE} from "../constants/token.constants";

export const createUser = async ({ firstName, lastName, email, password }: CreateUserParams) => {
  const candidate = await UserModel.findOne({ email });

  if (candidate) {
    throw Exception.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  return await UserModel.create({ firstName, lastName, email, password: hash });
}

export const activateAccount = async ({ token, userAgent, host }: ActivateAccountParams) => {
  const document = await TokenService.verifyConfirmationToken({ token, userAgent, host });
  const { user: userId } = document;

  await TokenService.revokeToken({ document, userAgent, host, reason: TOKEN.REASON_FOR_REVOKE.CONFIRMED });

  const user = await UserModel.findById(userId);
  if (!user) {
    throw Exception.Forbidden('Пользователь не найден');
  }
  user.status = USER.STATUS.ACTIVE;
  await user.save();
};

export const changeUserPassword = async ({ token, newPassword, userAgent, host }: ChangeUserPasswordParams) => {
  const document = await TokenService.verifyConfirmationToken({ token, userAgent, host });
  const { user: userId } = document;

  await TokenService.revokeToken({ document, userAgent, host, reason: TOKEN.REASON_FOR_REVOKE.CONFIRMED });

  const user = await UserModel.findById(userId);
  if (!user) {
    throw Exception.NotFound('Пользователь не найден');
  }
  user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await user.save();
};


export const getUser = async () => {

}

export const updateUser = async () => {

}