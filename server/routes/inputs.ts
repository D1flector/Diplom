import { Router, Request, Response } from "express";
import pool from "../db.ts";
import { writeAuditLog } from "./audit.ts";

const router = Router();

router.get("/ppr-data", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ppr_data ORDER BY ppr_id ASC",
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/ppr-data", async (req: Request, res: Response) => {
  const { object_name, responsible_person, start_date_smr, technology_type } =
    req.body;
  try {
    const result = await pool.query(
      `INSERT INTO ppr_data (object_name, responsible_person, start_date_smr, technology_type)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        object_name,
        responsible_person,
        start_date_smr || null,
        technology_type || null,
      ],
    );
    await writeAuditLog(
      req,
      "INSERT",
      "ppr_data",
      `Создан объект строительства: "${object_name}"`,
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/ppr-data/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { object_name, responsible_person, start_date_smr, technology_type } =
    req.body;
  try {
    const result = await pool.query(
      `UPDATE ppr_data
       SET object_name = $1, responsible_person = $2, start_date_smr = $3, technology_type = $4
       WHERE ppr_id = $5 RETURNING *`,
      [
        object_name,
        responsible_person,
        start_date_smr || null,
        technology_type || null,
        id,
      ],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    await writeAuditLog(
      req,
      "UPDATE",
      "ppr_data",
      `Обновлены параметры объекта строительства: "${object_name}"`,
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/ppr-data/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pprResult = await pool.query(
      "SELECT object_name FROM ppr_data WHERE ppr_id = $1",
      [id],
    );
    const objName =
      pprResult.rows.length > 0 ? pprResult.rows[0].object_name : id;

    const result = await pool.query(
      "DELETE FROM ppr_data WHERE ppr_id = $1 RETURNING ppr_id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    await writeAuditLog(
      req,
      "DELETE",
      "ppr_data",
      `Удален объект строительства: "${objName}" (ID: ${id})`,
    );
    res.json({ id: Number(id) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/work-types", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM work_types ORDER BY work_type_id ASC",
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/work-types", async (req: Request, res: Response) => {
  const { work_name, complexity, specialists, staff_qty, duration } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO work_types (work_name, complexity, specialists, staff_qty, duration)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        work_name,
        parseFloat(complexity) || 0,
        specialists || null,
        parseInt(staff_qty) || 0,
        parseInt(duration) || 0,
      ],
    );
    await writeAuditLog(
      req,
      "INSERT",
      "work_types",
      `Добавлен новый вид работ: "${work_name}"`,
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/work-types/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { work_name, complexity, specialists, staff_qty, duration } = req.body;
  try {
    const result = await pool.query(
      `UPDATE work_types
       SET work_name = $1, complexity = $2, specialists = $3, staff_qty = $4, duration = $5
       WHERE work_type_id = $6 RETURNING *`,
      [
        work_name,
        parseFloat(complexity) || 0,
        specialists || null,
        parseInt(staff_qty) || 0,
        parseInt(duration) || 0,
        id,
      ],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    await writeAuditLog(
      req,
      "UPDATE",
      "work_types",
      `Обновлены параметры вида работ: "${work_name}"`,
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/work-types/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const wtResult = await pool.query(
      "SELECT work_name FROM work_types WHERE work_type_id = $1",
      [id],
    );
    const name = wtResult.rows.length > 0 ? wtResult.rows[0].work_name : id;

    const result = await pool.query(
      "DELETE FROM work_types WHERE work_type_id = $1 RETURNING work_type_id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    await writeAuditLog(
      req,
      "DELETE",
      "work_types",
      `Удален вид работ: "${name}" (ID: ${id})`,
    );
    res.json({ id: Number(id) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/client-deadlines", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT cd.*, p.object_name 
      FROM client_deadlines cd
      LEFT JOIN ppr_data p ON cd.ppr_id = p.ppr_id
      ORDER BY cd.deadline_id ASC
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/client-deadlines", async (req: Request, res: Response) => {
  const { ppr_id, stage_name, start_date, end_date, rigidity, comment } =
    req.body;
  try {
    const insertResult = await pool.query(
      `INSERT INTO client_deadlines (ppr_id, stage_name, start_date, end_date, rigidity, comment)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        parseInt(ppr_id),
        stage_name,
        start_date || null,
        end_date || null,
        rigidity || null,
        comment || null,
      ],
    );
    const fullRow = await pool.query(
      `
      SELECT cd.*, p.object_name 
      FROM client_deadlines cd
      LEFT JOIN ppr_data p ON cd.ppr_id = p.ppr_id
      WHERE cd.deadline_id = $1
    `,
      [insertResult.rows[0].deadline_id],
    );

    await writeAuditLog(
      req,
      "INSERT",
      "client_deadlines",
      `Добавлен директивный срок для этапа "${stage_name}" на объекте "${fullRow.rows[0].object_name}"`,
    );
    res.status(201).json(fullRow.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/client-deadlines/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ppr_id, stage_name, start_date, end_date, rigidity, comment } =
    req.body;
  try {
    const updateResult = await pool.query(
      `UPDATE client_deadlines
       SET ppr_id = $1, stage_name = $2, start_date = $3, end_date = $4, rigidity = $5, comment = $6
       WHERE deadline_id = $7 RETURNING *`,
      [
        parseInt(ppr_id),
        stage_name,
        start_date || null,
        end_date || null,
        rigidity || null,
        comment || null,
        id,
      ],
    );
    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    const fullRow = await pool.query(
      `
      SELECT cd.*, p.object_name 
      FROM client_deadlines cd
      LEFT JOIN ppr_data p ON cd.ppr_id = p.ppr_id
      WHERE cd.deadline_id = $1
    `,
      [id],
    );

    await writeAuditLog(
      req,
      "UPDATE",
      "client_deadlines",
      `Обновлен директивный срок для этапа "${stage_name}" на объекте "${fullRow.rows[0].object_name}"`,
    );
    res.json(fullRow.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/client-deadlines/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cdResult = await pool.query(
      `
      SELECT cd.*, p.object_name FROM client_deadlines cd
      LEFT JOIN ppr_data p ON cd.ppr_id = p.ppr_id
      WHERE cd.deadline_id = $1
    `,
      [id],
    );
    const details =
      cdResult.rows.length > 0
        ? `Удален директивный срок этапа "${cdResult.rows[0].stage_name}" объекта "${cdResult.rows[0].object_name}" (ID: ${id})`
        : `Удален директивный срок с ID: ${id}`;

    const result = await pool.query(
      "DELETE FROM client_deadlines WHERE deadline_id = $1 RETURNING deadline_id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    await writeAuditLog(req, "DELETE", "client_deadlines", details);
    res.json({ id: Number(id) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/work-volumes", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT wv.*, p.object_name, wt.work_name
      FROM work_volumes wv
      LEFT JOIN ppr_data p ON wv.ppr_id = p.ppr_id
      LEFT JOIN work_types wt ON wv.work_type_id = wt.work_type_id
      ORDER BY wv.vol_id ASC
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/work-volumes", async (req: Request, res: Response) => {
  const { ppr_id, work_type_id, volume, unit, dependency, duration_days } =
    req.body;
  try {
    const insertResult = await pool.query(
      `INSERT INTO work_volumes (ppr_id, work_type_id, volume, unit, dependency, duration_days)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        parseInt(ppr_id),
        parseInt(work_type_id),
        parseFloat(volume) || 0,
        unit || null,
        dependency || null,
        parseInt(duration_days) || 0,
      ],
    );
    const fullRow = await pool.query(
      `
      SELECT wv.*, p.object_name, wt.work_name
      FROM work_volumes wv
      LEFT JOIN ppr_data p ON wv.ppr_id = p.ppr_id
      LEFT JOIN work_types wt ON wv.work_type_id = wt.work_type_id
      WHERE wv.vol_id = $1
    `,
      [insertResult.rows[0].vol_id],
    );

    await writeAuditLog(
      req,
      "INSERT",
      "work_volumes",
      `Добавлен физический объем ВОР для работы "${fullRow.rows[0].work_name}" на объекте "${fullRow.rows[0].object_name}"`,
    );
    res.status(201).json(fullRow.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/work-volumes/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ppr_id, work_type_id, volume, unit, dependency, duration_days } =
    req.body;
  try {
    const updateResult = await pool.query(
      `UPDATE work_volumes
       SET ppr_id = $1, work_type_id = $2, volume = $3, unit = $4, dependency = $5, duration_days = $6
       WHERE vol_id = $7 RETURNING *`,
      [
        parseInt(ppr_id),
        parseInt(work_type_id),
        parseFloat(volume) || 0,
        unit || null,
        dependency || null,
        parseInt(duration_days) || 0,
        id,
      ],
    );
    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    const fullRow = await pool.query(
      `
      SELECT wv.*, p.object_name, wt.work_name
      FROM work_volumes wv
      LEFT JOIN ppr_data p ON wv.ppr_id = p.ppr_id
      LEFT JOIN work_types wt ON wv.work_type_id = wt.work_type_id
      WHERE wv.vol_id = $1
    `,
      [id],
    );

    await writeAuditLog(
      req,
      "UPDATE",
      "work_volumes",
      `Обновлен объем ВОР для работы "${fullRow.rows[0].work_name}" на объекте "${fullRow.rows[0].object_name}"`,
    );
    res.json(fullRow.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/work-volumes/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const wvResult = await pool.query(
      `
      SELECT wv.*, p.object_name, wt.work_name FROM work_volumes wv
      LEFT JOIN ppr_data p ON wv.ppr_id = p.ppr_id
      LEFT JOIN work_types wt ON wv.work_type_id = wt.work_type_id
      WHERE wv.vol_id = $1
    `,
      [id],
    );
    const details =
      wvResult.rows.length > 0
        ? `Удален объем ВОР работы "${wvResult.rows[0].work_name}" объекта "${wvResult.rows[0].object_name}" (ID: ${id})`
        : `Удален объем ВОР с ID: ${id}`;

    const result = await pool.query(
      "DELETE FROM work_volumes WHERE vol_id = $1 RETURNING vol_id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    await writeAuditLog(req, "DELETE", "work_volumes", details);
    res.json({ id: Number(id) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/project-spec", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT ps.*, p.object_name 
      FROM project_spec ps
      LEFT JOIN ppr_data p ON ps.ppr_id = p.ppr_id
      ORDER BY ps.spec_id ASC
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/project-spec", async (req: Request, res: Response) => {
  const { ppr_id, material_name, characteristics, unit, proj_vol } = req.body;
  try {
    const insertResult = await pool.query(
      `INSERT INTO project_spec (ppr_id, material_name, characteristics, unit, proj_vol)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        parseInt(ppr_id),
        material_name,
        characteristics || null,
        unit || null,
        parseFloat(proj_vol) || 0,
      ],
    );
    const fullRow = await pool.query(
      `
      SELECT ps.*, p.object_name 
      FROM project_spec ps
      LEFT JOIN ppr_data p ON ps.ppr_id = p.ppr_id
      WHERE ps.spec_id = $1
    `,
      [insertResult.rows[0].spec_id],
    );

    await writeAuditLog(
      req,
      "INSERT",
      "project_spec",
      `Добавлена позиция спецификации "${material_name}" для объекта "${fullRow.rows[0].object_name}"`,
    );
    res.status(201).json(fullRow.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/project-spec/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ppr_id, material_name, characteristics, unit, proj_vol } = req.body;
  try {
    const updateResult = await pool.query(
      `UPDATE project_spec
       SET ppr_id = $1, material_name = $2, characteristics = $3, unit = $4, proj_vol = $5
       WHERE spec_id = $6 RETURNING *`,
      [
        parseInt(ppr_id),
        material_name,
        characteristics || null,
        unit || null,
        parseFloat(proj_vol) || 0,
        id,
      ],
    );
    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    const fullRow = await pool.query(
      `
      SELECT ps.*, p.object_name 
      FROM project_spec ps
      LEFT JOIN ppr_data p ON ps.ppr_id = p.ppr_id
      WHERE ps.spec_id = $1
    `,
      [id],
    );

    await writeAuditLog(
      req,
      "UPDATE",
      "project_spec",
      `Обновлена позиция спецификации "${material_name}" для объекта "${fullRow.rows[0].object_name}"`,
    );
    res.json(fullRow.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/project-spec/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const psResult = await pool.query(
      `
      SELECT ps.*, p.object_name FROM project_spec ps
      LEFT JOIN ppr_data p ON ps.ppr_id = p.ppr_id
      WHERE ps.spec_id = $1
    `,
      [id],
    );
    const details =
      psResult.rows.length > 0
        ? `Удалена позиция спецификации "${psResult.rows[0].material_name}" объекта "${psResult.rows[0].object_name}" (ID: ${id})`
        : `Удалена позиция спецификации с ID: ${id}`;

    const result = await pool.query(
      "DELETE FROM project_spec WHERE spec_id = $1 RETURNING spec_id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    await writeAuditLog(req, "DELETE", "project_spec", details);
    res.json({ id: Number(id) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/contractors", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contractor_list ORDER BY cont_id ASC",
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/contractors", async (req: Request, res: Response) => {
  const {
    contract_id,
    org_name,
    contact_person,
    team_size,
    work_desc,
    offer_days,
    offer_cost,
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO contractor_list (contract_id, org_name, contact_person, team_size, work_desc, offer_days, offer_cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        contract_id || null,
        org_name,
        contact_person || null,
        parseInt(team_size) || 0,
        work_desc || null,
        parseInt(offer_days) || 0,
        parseFloat(offer_cost) || 0,
      ],
    );
    await writeAuditLog(
      req,
      "INSERT",
      "contractor_list",
      `Добавлено тендерное предложение подрядчика "${org_name}" по договору № ${contract_id}`,
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/contractors/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    contract_id,
    org_name,
    contact_person,
    team_size,
    work_desc,
    offer_days,
    offer_cost,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE contractor_list
       SET contract_id = $1, org_name = $2, contact_person = $3, team_size = $4, work_desc = $5, offer_days = $6, offer_cost = $7
       WHERE cont_id = $8 RETURNING *`,
      [
        contract_id || null,
        org_name,
        contact_person || null,
        parseInt(team_size) || 0,
        work_desc || null,
        parseInt(offer_days) || 0,
        parseFloat(offer_cost) || 0,
        id,
      ],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    await writeAuditLog(
      req,
      "UPDATE",
      "contractor_list",
      `Обновлено предложение подрядчика "${org_name}" по договору № ${contract_id}`,
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/contractors/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const contResult = await pool.query(
      "SELECT org_name, contract_id FROM contractor_list WHERE cont_id = $1",
      [id],
    );
    const details =
      contResult.rows.length > 0
        ? `Удалено предложение подрядчика "${contResult.rows[0].org_name}" по договору № ${contResult.rows[0].contract_id} (ID: ${id})`
        : `Удалено предложение подрядчика с ID: ${id}`;

    const result = await pool.query(
      "DELETE FROM contractor_list WHERE cont_id = $1 RETURNING cont_id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    await writeAuditLog(req, "DELETE", "contractor_list", details);
    res.json({ id: Number(id) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
