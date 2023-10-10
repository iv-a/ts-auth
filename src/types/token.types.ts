import {HydratedDocument} from "mongoose";
import { TOKEN } from "../constants";
import {REASON_FOR_REVOKE, TYPE} from "../constants/token.constants";
import {UserId} from "./";

export type Token = string;
export type TokenType = TYPE;
export type ExpiresAt = Date;
export type Revoked = boolean;
export type RevokedAt = Date;
export type ReasonForRevoke = REASON_FOR_REVOKE;
export type UserAgent = string;
export type Host = string;

export type TokenSchema = {
  token: Token;
  type: TokenType;
  user: UserId;
  expiresAt: ExpiresAt;
  revoked: Revoked;
  revokedAt?: RevokedAt;
  reasonForRevoke?: ReasonForRevoke;
  userAgent: UserAgent;
  host: Host;
}

export type SaveTokenParams = Omit<TokenSchema, "user"> & { userId: UserId };
export type GenerateAuthTokensParams = Pick<SaveTokenParams, "userId" | "userAgent" | "host">;
export type GenerateConfirmationTokenParams = GenerateAuthTokensParams;

export type AuthTokens = {
  accessToken: Token;
  accessTokenExpirationDate: Date;
  refreshToken: Token;
  refreshTokenExpirationDate: Date;
}

export type RevokeTokenParams = {
  document: HydratedDocument<TokenSchema>;
  userAgent: UserAgent;
  host: Host;
  reason?: ReasonForRevoke;
}
export type VerifyRefreshTokenParams = Pick<SaveTokenParams, "token" | "userAgent" | "host">;
export type VerifyConfirmationTokenParams = VerifyRefreshTokenParams;