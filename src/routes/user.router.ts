import express from "express";
import { UserController } from "../controllers";
import {PATH} from "../constants";

const router = express.Router();

router.get(PATH.ACTIVATE + '/:token', UserController.activateAccount);
router.patch(PATH.CHANGE_PASSWORD, UserController.changeUserPassword);
router.patch(PATH.CHANGE_PASSWORD + '/:token', UserController.changeUserPassword);


export default router;