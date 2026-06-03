import { Router, Request, Response } from "express";
import pool from "../db.ts";
import { writeAuditLog } from "./audit.ts";

const router = Router();

router.get("/mtr-norms", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT cn.*, wt.work_name 
      FROM consumption_norms cn
      LEFT JOIN work_types wt ON cn.work_type_id = wt.work_type_id
      ORDER BY cn.norm_id ASC
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/mtr-norms", async (req: Request, res: Response) => {
  const { work_type_id, res_category, coeff_k, rationale } = req.body;
  try {
    const insertResult = await pool.query(
      `INSERT INTO consumption_norms (work_type_id, res_category, coeff_k, rationale)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        parseInt(work_type_id),
        res_category,
        parseFloat(coeff_k) || 0,
        rationale || null,
      ],
    );

    const fullRow = await pool.query(
      `
      SELECT cn.*, wt.work_name 
      FROM consumption_norms cn
      LEFT JOIN work_types wt ON cn.work_type_id = wt.work_type_id
      WHERE cn.norm_id = $1
    `,
      [insertResult.rows[0].norm_id],
    );

    await writeAuditLog(
      req,
      "INSERT",
      "consumption_norms",
      `Добавлена норма расхода материала "${res_category}" для вида работ "${fullRow.rows[0].work_name}"`,
    );
    res.status(201).json(fullRow.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/mtr-norms/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { work_type_id, res_category, coeff_k, rationale } = req.body;
  try {
    const updateResult = await pool.query(
      `UPDATE consumption_norms
       SET work_type_id = $1, res_category = $2, coeff_k = $3, rationale = $4
       WHERE norm_id = $5 RETURNING *`,
      [
        parseInt(work_type_id),
        res_category,
        parseFloat(coeff_k) || 0,
        rationale || null,
        id,
      ],
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }

    const fullRow = await pool.query(
      `
      SELECT cn.*, wt.work_name 
      FROM consumption_norms cn
      LEFT JOIN work_types wt ON cn.work_type_id = wt.work_type_id
      WHERE cn.norm_id = $1
    `,
      [id],
    );

    await writeAuditLog(
      req,
      "UPDATE",
      "consumption_norms",
      `Обновлена норма расхода материала "${res_category}" для вида работ "${fullRow.rows[0].work_name}"`,
    );
    res.json(fullRow.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/mtr-norms/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cnResult = await pool.query(
      `
      SELECT cn.*, wt.work_name FROM consumption_norms cn
      LEFT JOIN work_types wt ON cn.work_type_id = wt.work_type_id
      WHERE cn.norm_id = $1
    `,
      [id],
    );
    const details =
      cnResult.rows.length > 0
        ? `Удалена норма расхода материала "${cnResult.rows[0].res_category}" для вида работ "${cnResult.rows[0].work_name}" (ID: ${id})`
        : `Удалена норма расхода МТР с ID: ${id}`;

    const result = await pool.query(
      "DELETE FROM consumption_norms WHERE norm_id = $1 RETURNING norm_id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    await writeAuditLog(req, "DELETE", "consumption_norms", details);
    res.json({ id: Number(id) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/labor-norms", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT ln.*, wt.work_name 
      FROM labor_norms ln
      LEFT JOIN work_types wt ON ln.work_type_id = wt.work_type_id
      ORDER BY ln.norm_id ASC
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/labor-norms", async (req: Request, res: Response) => {
  const { work_type_id, specialty, rank, manhour_norm } = req.body;
  try {
    const insertResult = await pool.query(
      `INSERT INTO labor_norms (work_type_id, specialty, rank, manhour_norm)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        parseInt(work_type_id),
        specialty,
        parseInt(rank) || 1,
        parseFloat(manhour_norm) || 0,
      ],
    );

    const fullRow = await pool.query(
      `
      SELECT ln.*, wt.work_name 
      FROM labor_norms ln
      LEFT JOIN work_types wt ON ln.work_type_id = wt.work_type_id
      WHERE ln.norm_id = $1
    `,
      [insertResult.rows[0].norm_id],
    );

    await writeAuditLog(
      req,
      "INSERT",
      "labor_norms",
      `Добавлена трудовая норма для специальности "${specialty}" (${rank} разряд) для вида работ "${fullRow.rows[0].work_name}"`,
    );
    res.status(201).json(fullRow.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/labor-norms/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { work_type_id, specialty, rank, manhour_norm } = req.body;
  try {
    const updateResult = await pool.query(
      `UPDATE labor_norms
       SET work_type_id = $1, specialty = $2, rank = $3, manhour_norm = $4
       WHERE norm_id = $5 RETURNING *`,
      [
        parseInt(work_type_id),
        specialty,
        parseInt(rank) || 1,
        parseFloat(manhour_norm) || 0,
        id,
      ],
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }

    const fullRow = await pool.query(
      `
      SELECT ln.*, wt.work_name 
      FROM labor_norms ln
      LEFT JOIN work_types wt ON ln.work_type_id = wt.work_type_id
      WHERE ln.norm_id = $1
    `,
      [id],
    );

    await writeAuditLog(
      req,
      "UPDATE",
      "labor_norms",
      `Обновлена трудовая норма для специальности "${specialty}" (${rank} разряд) для вида работ "${fullRow.rows[0].work_name}"`,
    );
    res.json(fullRow.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/labor-norms/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const lnResult = await pool.query(
      `
      SELECT ln.*, wt.work_name FROM labor_norms ln
      LEFT JOIN work_types wt ON ln.work_type_id = wt.work_type_id
      WHERE ln.norm_id = $1
    `,
      [id],
    );
    const details =
      lnResult.rows.length > 0
        ? `Удалена трудовая норма специальности "${lnResult.rows[0].specialty}" для вида работ "${lnResult.rows[0].work_name}" (ID: ${id})`
        : `Удалена трудовая норма с ID: ${id}`;

    const result = await pool.query(
      "DELETE FROM labor_norms WHERE norm_id = $1 RETURNING norm_id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    await writeAuditLog(req, "DELETE", "labor_norms", details);
    res.json({ id: Number(id) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
