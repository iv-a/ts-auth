import express from "express";
import { AuthController } from "../controllers";
import {PATH} from "../constants";

const router = express.Router();

router.post(PATH.SIGN_UP, AuthController.signUp);
router.post(PATH.SIGN_IN, AuthController.signIn);
router.post(PATH.SIGN_OUT, AuthController.signOut);
router.get(PATH.REFRESH, AuthController.refresh);

router.post(PATH.CHANGE_PASSWORD, AuthController.changePassword);
router.post(PATH.RESET_PASSWORD, AuthController.resetPassword);

export default router;