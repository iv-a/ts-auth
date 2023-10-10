import bcrypt from 'bcrypt';
import {TokenModel, UserModel} from "../models";
import {Exception} from "../exceptions";
import {TokenService, UserService} from "./";
import {
  ChangePasswordParams,
  RefreshAuthParams,
  ResetPasswordParams,
  SignInParams,
  SignOutParams,
  SignUpParams, TokenSchema
} from "../types";
import {sendActivationMail, sendResetPasswordMail} from "./mail.service";
// import {REASON_FOR_REVOKE} from "../constants/token.constants";
import {USER, TOKEN} from "../constants";
import {HydratedDocument} from "mongoose";


export const signUp = async ({ firstName, lastName, email, password, userAgent, host }: SignUpParams) => {
  const { _id: userId } = await UserService.createUser({ firstName, lastName, email, password });

  const { confirmationToken } = await TokenService.generateConfirmationToken({ userId, userAgent, host });

  await sendActivationMail({ email, confirmationToken });
};

export const signIn = async ({ email, password, userAgent, host }: SignInParams) => {
  const user = await UserModel.findOne({ email }).select('+password');

  if (!user) {
    throw Exception.BadRequest('Неверные почта или пароль');
  }

  const { password: hash, _id: userId, status } = user;

  if (status === USER.STATUS.PENDING) {
    throw Exception.BadRequest('Требуется активация аккаунта');
  }

  if (! await bcrypt.compare(password, hash)) {
    throw Exception.BadRequest('Неверные почта или пароль');
  }

  const tokens = await TokenService.generateAuthTokens({ userId, userAgent, host });
  return {
    userId,
    ...tokens,
  };
};

export const signOut = async ({ token, userAgent, host }: SignOutParams) => {
  const document: HydratedDocument<TokenSchema> | null = await TokenModel.findOne({ token });
  if (!document) {
    throw Exception.BadRequest('Что-то не так')
  }
  await TokenService.revokeToken({ document, userAgent, host, reason: TOKEN.REASON_FOR_REVOKE.SIGN_OUT });
};

export const refreshAuth = async ({ token, userAgent, host }: RefreshAuthParams) => {
  const document = await TokenService.verifyRefreshToken({ token, userAgent, host });
  await TokenService.revokeToken({ document, userAgent, host, reason: TOKEN.REASON_FOR_REVOKE.REFRESHED });

  const userId = document.user;

  return await TokenService.generateAuthTokens({ userId, userAgent, host });
};

export const changePassword = async ({ userId, prevPassword, userAgent, host }: ChangePasswordParams) => {
  const user = await UserModel.findById(userId).select('+password');

  if (!user) {
    throw Exception.NotFound('Пользователь не найден');
  }

  const { password: hash } = user;

  if (! await bcrypt.compare(prevPassword, hash)) {
    throw Exception.BadRequest('Неверные почта или пароль');
  }

  return await TokenService.generateConfirmationToken({ userId, userAgent, host });
};

export const resetPassword = async ({ email, userAgent, host }: ResetPasswordParams) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw Exception.NotFound('Пользователь не найден');
  }

  const { _id: userId } = user;

  const {
    confirmationToken,
  } = await TokenService.generateConfirmationToken({ userId, userAgent, host });

  await sendResetPasswordMail({ email, confirmationToken });
};

