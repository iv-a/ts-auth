import { NextFunction, Request, Response } from "express";
import { Exception } from "../exceptions";
import { EXCEPTION } from "../utils/constants/constants";

export const errorsHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err instanceof Exception) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  res.status(500).json({ message: EXCEPTION.INTERNAL_SERVER_ERROR });
  return next();
}