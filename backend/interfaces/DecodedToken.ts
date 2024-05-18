import { User } from "@prisma/client";

export interface DecodedToken {
  user: User;
}
