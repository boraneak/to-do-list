import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  try {
    await prisma.user.createMany({
      data: [
        {
          username: "user1",
          displayName: "User One",
          imageUrl: "https://example.com/user1.jpg",
          password: "password1",
        },
        {
          username: "user2",
          displayName: "User Two",
          imageUrl: "https://example.com/user2.jpg",
          password: "password2",
        },
      ],
    });

    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
