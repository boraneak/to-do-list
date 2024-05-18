import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { AuthRequest } from "../../interfaces/AuthRequest";

const prisma = new PrismaClient();

export const getAllBoards = async (req: Request, res: Response) => {
  try {
    const allBoards = await prisma.board.findMany({
      include: {
        owner: true,
        members: true,
        lists: true,
        cards: true,
        activities: true,
      },
    });
    return res.json(allBoards);
  } catch (error) {
    console.error("Error fetching boards:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createBoard = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      background,
    }: {
      name: string;
      background: string;
    } = req.body;
    const userId = req.user!.id;
    if (!name || !background) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const board = await prisma.board.create({
      data: {
        name,
        background,
        ownerId: userId,
      },
    });
    res.status(201).json(board);
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBoardById = async (req: Request, res: Response) => {
  try {
    const boardId: number = parseInt(req.params.id, 10);
    const {
      name,
      background,
    }: {
      name?: string;
      background?: string;
    } = req.body;
    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: {
        name,
        background,
      },
      include: {
        owner: true,
        members: true,
        lists: true,
        cards: true,
        activities: true,
      },
    });
    res.status(200).json(updatedBoard);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBoardById = async (req: Request, res: Response) => {
  try {
    const boardId: number = parseInt(req.params.id, 10);
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        owner: true,
        members: true,
        lists: true,
        cards: true,
        activities: true,
      },
    });
    if (!board) {
      res.status(404).json({ error: "Board not found" });
      return;
    }
    res.status(200).json(board);
  } catch (error) {
    console.error("Error fetching board by id", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBoardById = async (req: Request, res: Response) => {
  try {
    const boardId: number = parseInt(req.params.id, 10);
    await prisma.board.delete({ where: { id: boardId } });
    res.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "Board not found" });
        return;
      }
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
