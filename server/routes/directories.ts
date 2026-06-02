import { Router, Request, Response } from "express";
import pool from "../db.ts";

const router = Router();

// =========================================================================
// 1. НОРМЫ РАСХОДА МТР (consumption_norms)
// =========================================================================

// Получить все нормы МТР
router.get("/mtr-norms", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM consumption_norms ORDER BY norm_id ASC",
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Добавить новую норму МТР
router.post("/mtr-norms", async (req: Request, res: Response) => {
  const { work_name, res_category, coeff_k, rationale } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO consumption_norms (work_name, res_category, coeff_k, rationale)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [work_name, res_category, parseFloat(coeff_k) || 0, rationale || null],
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Обновить существующую норму МТР
router.put("/mtr-norms/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { work_name, res_category, coeff_k, rationale } = req.body;
  try {
    const result = await pool.query(
      `UPDATE consumption_norms
       SET work_name = $1, res_category = $2, coeff_k = $3, rationale = $4
       WHERE norm_id = $5 RETURNING *`,
      [
        work_name,
        res_category,
        parseFloat(coeff_k) || 0,
        rationale || null,
        id,
      ],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Удалить норму МТР
router.delete("/mtr-norms/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM consumption_norms WHERE norm_id = $1 RETURNING norm_id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    res.json({ id: Number(id) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 2. ТРУДОВЫЕ НОРМАТИВЫ (labor_norms)
// =========================================================================

// Получить все нормы труда
router.get("/labor-norms", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM labor_norms ORDER BY norm_id ASC",
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Добавить новую норму труда
router.post("/labor-norms", async (req: Request, res: Response) => {
  const { work_name, specialty, rank, manhour_norm } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO labor_norms (work_name, specialty, rank, manhour_norm)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        work_name,
        specialty,
        parseInt(rank) || 1,
        parseFloat(manhour_norm) || 0,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Обновить существующую норму труда
router.put("/labor-norms/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { work_name, specialty, rank, manhour_norm } = req.body;
  try {
    const result = await pool.query(
      `UPDATE labor_norms
       SET work_name = $1, specialty = $2, rank = $3, manhour_norm = $4
       WHERE norm_id = $5 RETURNING *`,
      [
        work_name,
        specialty,
        parseInt(rank) || 1,
        parseFloat(manhour_norm) || 0,
        id,
      ],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Удалить норму труда
router.delete("/labor-norms/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM labor_norms WHERE norm_id = $1 RETURNING norm_id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    res.json({ id: Number(id) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
