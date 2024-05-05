import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const hashedPassword = (password: string): Promise<string> => {
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
        username: "user1",
        displayName: "User One",
        imageUrl: "https://example.com/user1.jpg",
        password: hashedPassword1,
      },
      {
        username: "user2",
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
        username: { in: userData.map((user) => user.username) },
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
