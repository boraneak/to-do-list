import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllLists = async (req: Request, res: Response) => {
  try {
    const allList = await prisma.list.findMany({
      include: { board: true, cards: true },
    });
    res.json(allList);
  } catch (error) {
    console.error("Error fetching lists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const creatList = async (req: Request, res: Response) => {
  try {
    const {
      name,
      order,
      archived,
      boardId,
    }: {
      name: string;
      order: number;
      archived: boolean;
      boardId: number;
    } = req.body;
    const list = await prisma.list.create({
      data: {
        name,
        order,
        archived,
        boardId,
      },
    });
    res.status(201).json(list);
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const updateListById = async (req: Request, res: Response) => {
  try {
    const listId: number = parseInt(req.params.id, 10);
    const {
      name,
      order,
      archived,
      boardId,
    }: {
      name?: string;
      order?: number;
      archived?: boolean;
      boardId?: number;
    } = req.body;
    const updatedList = await prisma.list.update({
      where: { id: listId },
      data: {
        name,
        order,
        archived,
        boardId,
      },
    });
    res.status(200).json(updatedList);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getListById = async (req: Request, res: Response) => {
  try {
    const listId: number = parseInt(req.params.id, 10);
    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: {
        board: true,
        cards: true,
      },
    });
    if (!list) {
      res.status(404).json({ error: "List not found" });
      return;
    }
    res.status(200).json(list);
  } catch (error) {
    console.error("Error fetching list by id", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteListById = async (req: Request, res: Response) => {
  try {
    const listId: number = parseInt(req.params.id, 10);
    await prisma.list.delete({ where: { id: listId } });
    res.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "List not found" });
        return;
      }
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
