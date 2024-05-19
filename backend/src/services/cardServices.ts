import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllCards = async (req: Request, res: Response) => {
  try {
    const allCards = await prisma.card.findMany({
      include: { board: true, assignees: true, list: true },
    });
    res.json(allCards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      listId,
      boardId,
    }: {
      title: string;
      description: string;
      listId: number;
      boardId: number;
    } = req.body;
    const card = await prisma.card.create({
      data: {
        title,
        description,
        listId,
        boardId,
      },
    });
    // TODO: log the activity
    res.status(201).json(card);
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const updateCardById = async (req: Request, res: Response) => {
  try {
    const cardId: number = parseInt(req.params.id, 10);
    const {
      title,
      description,
      order,
      archived,
      listId,
      boardId,
    }: {
      title?: string;
      description?: string;
      order?: number;
      archived?: boolean;
      listId?: number;
      boardId?: number;
    } = req.body;
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        title,
        description,
        order,
        archived,
        listId,
        boardId,
      },
    });
    // TODO: log the activity
    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCardById = async (req: Request, res: Response) => {
  try {
    const cardId: number = parseInt(req.params.id, 10);
    const card = await prisma.card.findUnique({ where: { id: cardId } });
    if (!card) {
      res.status(404).json({ error: "Card not found" });
      return;
    }
    res.status(200).json(card);
  } catch (error) {
    console.error("Error fetching card by id", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCardById = async (req: Request, res: Response) => {
  try {
    const cardId: number = parseInt(req.params.id, 10);
    await prisma.card.delete({ where: { id: cardId } });
    // TODO: log the activity
    res.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "Card not found" });
        return;
      }
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
