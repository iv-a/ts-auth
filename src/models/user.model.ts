import {model, Schema} from "mongoose";
import {STATUS} from "../constants/user.constants";


const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  status: {
    type: String,
    required: true,
    enum: [ STATUS.PENDING, STATUS.ACTIVE ],
    default: STATUS.PENDING,
  },
}, { timestamps: true });

export const UserModel = model('User', userSchema);