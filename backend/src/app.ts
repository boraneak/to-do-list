import express from "express";
import "dotenv/config";
import { connectToDatabase } from "../utils/database";
const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, async () => {
  await connectToDatabase();
  return console.log(`Express is listening at http://localhost:${port}`);
});
