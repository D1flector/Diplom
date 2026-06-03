import { Router, Request, Response } from "express";
import pool from "../db.ts";

const router = Router();

export const writeAuditLog = async (
  req: Request,
  actionType: string,
  tableName: string,
  details: string,
) => {
  const headerUser = req.headers["x-user-username"] as string;
  const username = headerUser ? decodeURIComponent(headerUser) : "Система";
  try {
    await pool.query(
      `INSERT INTO audit_logs (username, action_type, table_name, details) 
       VALUES ($1, $2, $3, $4)`,
      [username, actionType, tableName, details],
    );
    console.log(
      `[АУДИТ БЕЗОПАСНОСТИ] Пользователь "${username}" выполнил действие: ${details}`,
    );
  } catch (err) {
    console.error("Не удалось записать системный лог аудита:", err);
  }
};

router.get("/audit-logs", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM audit_logs ORDER BY action_time DESC",
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
