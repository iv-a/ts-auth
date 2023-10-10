import {Response} from "express";
import {AuthTokens} from "../types";

export const setTokenCookies = (res: Response, tokens: AuthTokens) => {
  const {
    accessToken,
    accessTokenExpirationDate,
    refreshToken,
    refreshTokenExpirationDate
  } = tokens;

  res.cookie('access_token', accessToken, {
    expires: accessTokenExpirationDate,
    httpOnly: true,
    // secure: true,
    signed: true,
  });
  res.cookie('refresh_token', refreshToken, {
    expires: refreshTokenExpirationDate,
    httpOnly: true,
    // secure: true,
    signed: true,
    path: '/refresh',
  });
  res.cookie('refresh_token', refreshToken, {
    expires: refreshTokenExpirationDate,
    httpOnly: true,
    // secure: true,
    signed: true,
    path: '/signout',
  });
}

export const clearAuthCookies = (res: Response) => {
  res.clearCookie('access_token', { path: '/'});
  res.clearCookie('refresh_token', { path: '/refresh'});
  res.clearCookie('refresh_token', { path: '/signout'});
}