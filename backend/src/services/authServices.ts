import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET!;
const tokenDuration = process.env.TOKEN_DURATION;
export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
    }: {
      email: string;
      password: string;
    } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      } as Prisma.UserCreateInput, // Explicit cast to Prisma generated type
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
    }: {
      email: string;
      password: string;
    } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const foundUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!foundUser) {
      return res.status(400).send("Invalid email or password");
    }
    // check if password is correct
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }
    // create token
    const token = jwt.sign({ user: foundUser }, jwtSecret, {
      expiresIn: tokenDuration,
    });
    return res.status(200).json({ email: foundUser.email, token: token });
  } catch (error) {
    console.error("Error logging in", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
