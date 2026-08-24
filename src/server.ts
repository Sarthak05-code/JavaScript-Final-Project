import express from "express";
import dotenv from "dotenv";
import pool from "./db";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS currentTime");

    res.json({
      message: "VaultBoard API connected!",
      databaseTime: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Database connection failed.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
