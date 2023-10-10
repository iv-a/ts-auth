import {NextFunction, Request, Response} from "express";

export const clientDetailsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.body.clientDetails = {
    userAgent: req.headers['user-agent'] || '',
    host: req.ip || req.connection.remoteAddress || '',
  };

  next();
}