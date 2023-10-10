import jwt, {JwtPayload} from 'jsonwebtoken';
import {getExpirationDate} from "../utils";
import {
  GenerateAuthTokensParams,
  GenerateConfirmationTokenParams, RevokeTokenParams,
  SaveTokenParams,
  VerifyConfirmationTokenParams, VerifyRefreshTokenParams,

} from "../types";
import {
  JWT_ACCESS_EXPIRATION_TIME,
  JWT_ACCESS_SECRET,
  JWT_CONFIRM_EXPIRATION_TIME,
  JWT_CONFIRM_SECRET,
  JWT_REFRESH_EXPIRATION_TIME,
  JWT_REFRESH_SECRET
} from "../configs";
import {REASON_FOR_REVOKE, TYPE} from "../constants/token.constants";
import {TokenModel} from "../models";
import {Exception} from "../exceptions";


export const validateToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    return null;
  }
}

export const saveToken = async ({
                                  token,
                                  type,
                                  userId,
                                  expiresAt,
                                  revoked,
                                  revokedAt,
                                  reasonForRevoke,
                                  userAgent,
                                  host,
                                }: SaveTokenParams) => {
  let document = await TokenModel.findOne({ token });
  if (document) {
    document.expiresAt = expiresAt;
    document.revoked = revoked;
    document.revokedAt = revokedAt;
    document.reasonForRevoke = reasonForRevoke;
    document.userAgent = userAgent;
    document.host = host;
    await document.save();
  } else {
    document = await TokenModel.create({
      token,
      type,
      user: userId,
      expiresAt,
      revoked,
      revokedAt,
      reasonForRevoke,
      userAgent,
      host,
    });
  }
  return document;
};

export const generateToken = (payload: JwtPayload, secret: string, expirationTime: string): [string, Date] => {
  const expiresAt = getExpirationDate(expirationTime);

  const token = jwt.sign({
    ...payload,
    exp: Math.floor(Number(expiresAt) / 1000),
  }, secret);

  return [token, expiresAt];
}

export const generateAuthTokens = async ({
                                           userId,
                                           userAgent,
                                           host,
                                         }: GenerateAuthTokensParams) => {
  const payload = { userId };
  const [accessToken, accessTokenExpirationDate] = generateToken(payload, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRATION_TIME);
  const [refreshToken, refreshTokenExpirationDate] = generateToken(payload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION_TIME);

  await saveToken({
    token: refreshToken,
    type: TYPE.REFRESH,
    userId,
    expiresAt: refreshTokenExpirationDate,
    revoked: false,
    userAgent,
    host,
  });

  return {
    accessToken,
    accessTokenExpirationDate,
    refreshToken,
    refreshTokenExpirationDate
  };
};

export const generateConfirmationToken = async ({
                                                  userId,
                                                  userAgent,
                                                  host,
                                                }: GenerateConfirmationTokenParams) => {
  const payload = { userId };
  const [ confirmationToken, confirmationTokenExpirationDate ] = generateToken(payload, JWT_CONFIRM_SECRET, JWT_CONFIRM_EXPIRATION_TIME);

  await saveToken({
    token: confirmationToken,
    type: TYPE.CONFIRMATION,
    userId,
    expiresAt: confirmationTokenExpirationDate,
    revoked: false,
    userAgent,
    host,
  });

  return {
    confirmationToken,
    confirmationTokenExpirationDate,
  };
};

export const revokeToken = async ({ document, userAgent, host, reason }: RevokeTokenParams) => {
  document.revoked = true;
  document.revokedAt = new Date();
  if (reason) {
    document.reasonForRevoke = reason;
  } else if (document.expiresAt < new Date()) {
    document.reasonForRevoke = REASON_FOR_REVOKE.EXPIRED;
  } else {
    document.reasonForRevoke = REASON_FOR_REVOKE.UNKNOWN;
  }
  document.userAgent = userAgent;
  document.host = host;
  await document.save();
}

export const verifyRefreshToken = async ({ token, userAgent, host }: VerifyRefreshTokenParams) => {
  if (!token) {
    throw Exception.Forbidden('Необходима авторизация');
  }

  const document = await TokenModel.findOne({ token });
  if (!document) {
    throw Exception.Forbidden('Необходима авторизация');
  }

  const { revoked } = document;
  if (revoked) {
    throw Exception.Forbidden('Необходима авторизация');
  }

  const payload = validateToken(token, JWT_REFRESH_SECRET);

  if (!payload) {
    await revokeToken({ document, userAgent, host });
    throw Exception.Forbidden('Необходима авторизация');
  }

  return document;
};

export const verifyConfirmationToken = async ({ token, userAgent, host }: VerifyConfirmationTokenParams) => {
  if (!token) {
    throw Exception.BadRequest('Токен не действителен');
  }

  const document = await TokenModel.findOne({ token });

  if (!document) {
    throw Exception.BadRequest('Токен не действителен');
  }

  const { revoked, reasonForRevoke } = document;
  if (revoked) {
    throw Exception.BadRequest(`${reasonForRevoke}`);
  }

  const payload = validateToken(token, JWT_CONFIRM_SECRET);

  if (!payload) {
    await revokeToken({ document, userAgent, host });
    throw Exception.BadRequest('Токен не действителен');
  }

  return document;
};