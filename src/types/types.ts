import { Request } from "express";

export type ClientDetails = {
  userAgent: string;
  host: string;
}

export interface RequestWithClientDetails extends Request {
  clientDetails: ClientDetails;
}