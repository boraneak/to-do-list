import { Request } from "express";
// an interface that extends the Request object
export interface AuthenticatedRequest extends Request {
  user?: NonNullable<unknown>;
}
// decoded token interface
export interface DecodedToken {
  user: {
    id: number;
    email: string;
    displayName: string | null;
    imageUrl: string | null;
    password: string;
    createdAt: string;
    updatedAt: string;
  };
  iat: number;
  exp: number;
}
