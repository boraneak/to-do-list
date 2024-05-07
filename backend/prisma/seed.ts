import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const hashedPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

const prisma = new PrismaClient();

async function seed() {
  try {
    const [hashedPassword1, hashedPassword2] = await Promise.all([
      hashedPassword("password1"),
      hashedPassword("password2"),
    ]);

    const userData = [
      {
        email: "user1@example.com",
        displayName: "User One",
        imageUrl: "https://example.com/user1.jpg",
        password: hashedPassword1,
      },
      {
        email: "user2@example.com",
        displayName: "User Two",
        imageUrl: "https://example.com/user2.jpg",
        password: hashedPassword2,
      },
    ];

    await prisma.user.createMany({
      data: userData,
    });

    const createdUsers = await prisma.user.findMany({
      where: {
        email: { in: userData.map((user) => user.email) },
      },
    });

    console.log(createdUsers);
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
