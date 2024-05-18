import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET!;
const tokenDuration = process.env.TOKEN_DURATION;

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany({
      include: {
        boards: true,
        boardMembers: true,
        cards: true,
        activities: true,
      },
    });
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      email,
      displayName,
      imageUrl,
      password,
    }: {
      email: string;
      displayName: string;
      imageUrl: string;
      password: string;
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        displayName,
        imageUrl,
        password: hashedPassword,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const updateUserById = async (req: Request, res: Response) => {
  try {
    const userId: number = parseInt(req.params.id, 10);
    const {
      email,
      displayName,
      imageUrl,
      password,
    }: {
      email?: string;
      displayName?: string;
      imageUrl?: string;
      password?: string;
    } = req.body;
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        displayName,
        imageUrl,
        password: hashedPassword,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId: number = parseInt(req.params.id, 10);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by id", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId: number = parseInt(req.params.id, 10);
    await prisma.user.delete({ where: { id: userId } });
    res.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "User not found" });
        return;
      }
    }
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
