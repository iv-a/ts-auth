import {Request, Response, NextFunction} from 'express';

export const asyncCatch = (callback: (req: Request, res: Response, next: NextFunction) => void) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await callback(req, res, next);
  } catch (e) {
    next(e);
  }
}