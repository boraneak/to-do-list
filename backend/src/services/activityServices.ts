import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const allActivities = await prisma.activity.findMany({
      include: {
        user: true,
        board: true,
      },
    });
    res.json(allActivities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
