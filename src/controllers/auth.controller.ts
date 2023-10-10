import {AuthService} from '../services';
import {asyncCatch} from "../utils/async-handler";
import {clearAuthCookies, setTokenCookies} from "../utils";

export const signUp = asyncCatch(async (req, res) => {
  const { firstName, lastName, email, password, clientDetails } = req.body;
  const { userAgent, host } = clientDetails;

  await AuthService.signUp({
    firstName, lastName, email, password,
    userAgent, host,
  });

  res.status(200).send({ message: "User was registered successfully! Please check your email" });
});

export const signIn = asyncCatch(async (req, res) => {
  const { email, password, clientDetails } = req.body;
  const { userAgent, host } = clientDetails;

  const {
    userId,
    accessToken,
    accessTokenExpirationDate,
    refreshToken,
    refreshTokenExpirationDate,
  } = await AuthService.signIn({ email, password, userAgent, host });

  setTokenCookies(res, { accessToken, accessTokenExpirationDate, refreshToken, refreshTokenExpirationDate });
  res.status(200).send({ userId });
});

export const signOut = asyncCatch(async (req, res) => {
  const { userAgent, host } = req.body.clientDetails;
  const token = req.signedCookies['refresh_token'];

  await AuthService.signOut({ token, userAgent, host });

  clearAuthCookies(res);

  res.status(200).send({ message: 'Success'});
});

export const refresh = asyncCatch(async (req, res) => {
  const token = req.signedCookies['refresh_token'];
  const { userAgent, host } = req.body.clientDetails;
  const {
    accessToken,
    accessTokenExpirationDate,
    refreshToken,
    refreshTokenExpirationDate,
  } = await AuthService.refreshAuth({ token, userAgent, host });

  setTokenCookies(res, { accessToken, accessTokenExpirationDate, refreshToken, refreshTokenExpirationDate });

  res.status(200).send({ message: 'Success'});
});

export const changePassword = asyncCatch(async (req, res) => {
  const { userId, prevPassword, clientDetails } = req.body;
  const { userAgent, host } = clientDetails;

  const { confirmationToken, confirmationTokenExpirationDate } = await AuthService.changePassword({ userId, prevPassword, userAgent, host });
  res.cookie('reset_password_token', confirmationToken, {
    expires: confirmationTokenExpirationDate,
    httpOnly: true,
    // secure: true,
    signed: true,
    path: '/account/change-password',
  })
  res.status(200).send({ message: 'Success' });
});

export const resetPassword = asyncCatch(async (req, res) => {
  const { email, clientDetails } = req.body;
  const { userAgent, host } = clientDetails;

  await AuthService.resetPassword({ email, userAgent, host });

  res.status(200).send({ message: 'Check your mail'});
});