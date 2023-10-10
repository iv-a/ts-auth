import {model, Schema} from 'mongoose';
import {TokenSchema} from "../types";
import {REASON_FOR_REVOKE, TYPE} from "../constants/token.constants";

const tokenSchema = new Schema<TokenSchema>({
  token: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: [ TYPE.REFRESH, TYPE.CONFIRMATION ],
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  revoked: {
    type: Boolean,
    default: false,
    required: true,
  },
  revokedAt: {
    type: Date,
  },
  reasonForRevoke: {
    type: String,
    enum: [
      REASON_FOR_REVOKE.SIGN_OUT,
      REASON_FOR_REVOKE.EXPIRED,
      REASON_FOR_REVOKE.REFRESHED,
      REASON_FOR_REVOKE.CONFIRMED,
      REASON_FOR_REVOKE.UNKNOWN,
    ],
  },
  userAgent: {
    type: String,
    required: true,
  },
  host: {
    type: String,
    required: true,
  }
},{ timestamps: true });

export const TokenModel = model<TokenSchema>('Token', tokenSchema);