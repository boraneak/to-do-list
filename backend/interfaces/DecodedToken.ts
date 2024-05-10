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
