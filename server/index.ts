import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import pool from "./db.ts";
import directoryRouter from "./routes/directories.ts";
import inputsRouter from "./routes/inputs.ts";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", inputsRouter);

// Подключаем наши API-маршруты
app.use("/api", directoryRouter); // <-- Все пути из directories.ts будут начинаться с /api

// Твой старый тестовый роут остается на месте
app.get("/api/test-db", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "success",
      message: "Бэкенд на TypeScript успешно подключен к базе!",
      db_time: result.rows[0].now,
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
