import { UserService } from "../services";
import {asyncCatch} from "../utils/async-handler";

export const activateAccount = asyncCatch(async (req, res) => {
  const { token } = req.params;
  const { userAgent, host } = req.body.clientDetails;

  await UserService.activateAccount({ token, userAgent, host });

  res.status(200).send('Success');
});

export const changeUserPassword = asyncCatch(async (req, res) => {
  const token = req.params.token || req.signedCookies['reset_password_token'];

  const { newPassword, clientDetails } = req.body;
  const { userAgent, host } = clientDetails;
  await UserService.changeUserPassword({ token, newPassword, userAgent, host });

  res.clearCookie('reset_password_token', { path: '/account/change-password' });
  res.status(200).send('Success');
});

