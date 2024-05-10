import { Request } from "express";
// an interface that extends the Request object
export interface AuthenticatedRequest extends Request {
  user?: NonNullable<unknown>;
}
