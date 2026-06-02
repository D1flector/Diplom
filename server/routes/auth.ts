import { Router, Request, Response } from "express";
import pool from "../db.ts";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE LOWER(username) = LOWER($1)",
      [username],
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Пользователь с таким именем не найден" });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ error: "Неверный пароль" });
    }

    res.json({
      username: user.username,
      full_name: user.full_name,
      role: user.role,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
