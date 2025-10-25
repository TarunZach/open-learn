import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("OpenLearn Backend (TypeScript) is running...");
});

// MongoDB connection
const mongoURI = process.env.MONGO_URI || "";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected successfully.");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error("MongoDB connection error:", error));
