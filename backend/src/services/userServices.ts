import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

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
