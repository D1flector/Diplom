import { Router, Request, Response } from "express";
import pool from "../db.ts";
import { writeAuditLog } from "./audit.ts";

const router = Router();

router.get("/report/:taskId/:pprId", async (req: Request, res: Response) => {
  const { taskId, pprId } = req.params;
  try {
    let queryText = "";
    if (taskId === "1") {
      queryText = `
        SELECT cp.*, wt.work_name 
        FROM calendar_plan cp
        LEFT JOIN work_types wt ON cp.work_type_id = wt.work_type_id
        WHERE cp.ppr_id = $1
        ORDER BY cp.plan_id ASC`;
    } else if (taskId === "2") {
      queryText = `
        SELECT mp.*, ps.material_name as mat_name
        FROM mtr_plan mp
        LEFT JOIN project_spec ps ON mp.spec_id = ps.spec_id
        WHERE mp.ppr_id = $1
        ORDER BY mp.mtr_id ASC`;
    } else if (taskId === "3") {
      queryText = `
        SELECT lp.*, wt.work_name 
        FROM labor_plan lp
        LEFT JOIN work_types wt ON lp.work_type_id = wt.work_type_id
        WHERE lp.ppr_id = $1
        ORDER BY lp.labor_id ASC`;
    } else if (taskId === "4") {
      queryText = `
        SELECT sar.*, wt.work_name, cl.org_name as assigned_org
        FROM staff_allocation_result sar
        LEFT JOIN work_types wt ON sar.work_type_id = wt.work_type_id
        LEFT JOIN contractor_list cl ON sar.cont_id = cl.cont_id
        WHERE wt.work_type_id IN (
          SELECT work_type_id FROM work_volumes WHERE ppr_id = $1
        )
        ORDER BY sar.alloc_id ASC`;
    }

    const result = await pool.query(queryText, [pprId]);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/calculate/:pprId", async (req: Request, res: Response) => {
  const { pprId } = req.params;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log(`[РАСЧЕТ] Начало вычислений для проекта ID: ${pprId}`);

    const pprResult = await client.query(
      "SELECT * FROM ppr_data WHERE ppr_id = $1",
      [pprId],
    );
    if (pprResult.rows.length === 0) {
      throw new Error("Объект ППР не найден в базе данных");
    }
    const ppr = pprResult.rows[0];
    const startDateSmr = ppr.start_date_smr;

    const volumesResult = await client.query(
      `
      SELECT wv.*, wt.staff_qty, wt.complexity, wt.work_name
      FROM work_volumes wv
      JOIN work_types wt ON wv.work_type_id = wt.work_type_id
      WHERE wv.ppr_id = $1
      ORDER BY wv.vol_id ASC
    `,
      [pprId],
    );
    const volumes = volumesResult.rows;

    if (volumes.length === 0) {
      throw new Error(
        "В ведомости объемов работ (ВОР) нет записей для этого объекта. Расчет невозможен.",
      );
    }

    console.log(
      `[ЗАДАЧА 1] Найдено объемов работ для расчета: ${volumes.length}`,
    );

    await client.query("DELETE FROM calendar_plan WHERE ppr_id = $1", [pprId]);
    await client.query("DELETE FROM mtr_plan WHERE ppr_id = $1", [pprId]);
    await client.query("DELETE FROM labor_plan WHERE ppr_id = $1", [pprId]);
    await client.query(
      "DELETE FROM staff_allocation_result WHERE work_type_id IN (SELECT work_type_id FROM work_volumes WHERE ppr_id = $1)",
      [pprId],
    );

    let currentDate = new Date(startDateSmr);

    for (let i = 0; i < volumes.length; i++) {
      const vol = volumes[i];
      const duration = vol.duration_days;

      const totalManhours =
        vol.staff_qty * duration * 8 * parseFloat(vol.complexity);

      const startString = currentDate.toISOString().substring(0, 10);
      currentDate.setDate(currentDate.getDate() + duration);
      const endString = currentDate.toISOString().substring(0, 10);

      await client.query(
        `
        INSERT INTO calendar_plan (ppr_id, work_type_id, total_manhours, staff_qty, work_days, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          pprId,
          vol.work_type_id,
          totalManhours,
          vol.staff_qty,
          duration,
          startString,
          endString,
        ],
      );

      currentDate.setDate(currentDate.getDate() + 1);
    }
    console.log(`[ЗАДАЧА 1] Календарный план успешно рассчитан`);

    const specResult = await client.query(
      "SELECT * FROM project_spec WHERE ppr_id = $1",
      [pprId],
    );
    const specs = specResult.rows;
    console.log(`[ЗАДАЧА 2] Найдено позиций спецификации: ${specs.length}`);

    for (const spec of specs) {
      const normResult = await client.query(
        `
        SELECT cn.* FROM consumption_norms cn
        LEFT JOIN work_types wt ON cn.work_type_id = wt.work_type_id
        WHERE LOWER(cn.res_category) LIKE LOWER($1) 
           OR LOWER(cn.res_category) LIKE LOWER($2)
           OR LOWER(wt.work_name) LIKE LOWER($1)
        LIMIT 1
      `,
        [`%${spec.material_name}%`, `%${spec.material_name.substring(0, 4)}%`],
      );

      if (normResult.rows.length > 0) {
        const coeff = parseFloat(normResult.rows[0].coeff_k);
        const stageLink = normResult.rows[0].rationale || "СМР";
        const reqVolume = spec.proj_vol * coeff;

        const calResult = await client.query(
          `
          SELECT * FROM calendar_plan 
          WHERE ppr_id = $1 
          ORDER BY plan_id ASC LIMIT 1
        `,
          [pprId],
        );

        const deliveryDate =
          calResult.rows.length > 0
            ? calResult.rows[0].start_date
            : startDateSmr;

        await client.query(
          `
          INSERT INTO mtr_plan (ppr_id, spec_id, unit, req_volume, delivery_date, stage_link)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
          [pprId, spec.spec_id, spec.unit, reqVolume, deliveryDate, stageLink],
        );
      }
    }
    console.log(`[ЗАДАЧА 2] Ведомость МТР успешно рассчитана`);

    const calendarResult = await client.query(
      `
      SELECT cp.*, wv.volume, wv.vol_id, wt.work_name
      FROM calendar_plan cp
      JOIN work_volumes wv ON cp.ppr_id = wv.ppr_id AND cp.work_type_id = wv.work_type_id
      JOIN work_types wt ON cp.work_type_id = wt.work_type_id
      WHERE cp.ppr_id = $1
    `,
      [pprId],
    );

    const calPlans = calendarResult.rows;
    console.log(
      `[ЗАДАЧА 3] Найдено строк календарного плана: ${calPlans.length}`,
    );

    for (const cp of calPlans) {
      const laborNormResult = await client.query(
        `
        SELECT ln.* FROM labor_norms ln
        LEFT JOIN work_types wt ON ln.work_type_id = wt.work_type_id
        WHERE ln.work_type_id = $1 
           OR LOWER(wt.work_name) LIKE LOWER($2)
           OR LOWER(wt.work_name) LIKE LOWER($3)
        LIMIT 1
      `,
        [
          cp.work_type_id,
          `%${cp.work_name}%`,
          `%${cp.work_name.substring(0, 5)}%`,
        ],
      );

      if (laborNormResult.rows.length > 0) {
        const norm = laborNormResult.rows[0];
        const totalHours = cp.volume * parseFloat(norm.manhour_norm);
        const staffCount = Math.ceil(totalHours / (cp.work_days * 8));

        await client.query(
          `
          INSERT INTO labor_plan (ppr_id, work_type_id, specialty, work_days, total_hours, staff_count)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
          [
            pprId,
            cp.work_type_id,
            norm.specialty,
            cp.work_days,
            totalHours,
            staffCount,
          ],
        );
        console.log(
          `  -> [УСПЕХ] Найдена норма для работы "${cp.work_name}" (${norm.specialty})`,
        );
      } else {
        console.log(
          `  -> [ПРЕДУПРЕЖДЕНИЕ] Не найдена норма в labor_norms для работы "${cp.work_name}"!`,
        );
      }
    }
    console.log(`[ЗАДАЧА 3] Потребность в кадрах успешно рассчитана`);

    const laborPlanResult = await client.query(
      "SELECT * FROM labor_plan WHERE ppr_id = $1",
      [pprId],
    );
    const laborPlans = laborPlanResult.rows;
    console.log(
      `[ЗАДАЧА 4] Строк планов кадров для подбора подрядчиков: ${laborPlans.length}`,
    );

    for (const lp of laborPlans) {
      let searchPattern1 = `%${lp.specialty}%`;
      let searchPattern2 = `%${lp.specialty.substring(0, 4)}%`;
      let fallbackPattern = "%";

      if (lp.specialty.includes("Арматур")) {
        fallbackPattern = "%Армир%";
      } else if (lp.specialty.includes("Бетон")) {
        fallbackPattern = "%Бетон%";
      }

      const contractorsResult = await client.query(
        `
        SELECT * FROM contractor_list 
        WHERE LOWER(work_desc) LIKE LOWER($1) 
           OR LOWER(work_desc) LIKE LOWER($2)
           OR LOWER(work_desc) LIKE LOWER($3)
      `,
        [searchPattern1, searchPattern2, fallbackPattern],
      );

      const candidates = contractorsResult.rows;
      let bestContractor = null;
      let minL = Infinity;

      for (const c of candidates) {
        if (c.team_size >= lp.staff_count && c.offer_days <= lp.work_days) {
          const L =
            0.6 * c.offer_days + 0.4 * (parseFloat(c.offer_cost) / 100000);
          if (L < minL) {
            minL = L;
            bestContractor = c;
          }
        }
      }

      if (bestContractor) {
        const volResult = await client.query(
          "SELECT volume, unit FROM work_volumes WHERE ppr_id = $1 AND work_type_id = $2",
          [pprId, lp.work_type_id],
        );
        const volUnit =
          volResult.rows.length > 0
            ? `${volResult.rows[0].volume} ${volResult.rows[0].unit}`
            : "—";

        const calResult = await client.query(
          "SELECT start_date FROM calendar_plan WHERE ppr_id = $1 AND work_type_id = $2",
          [pprId, lp.work_type_id],
        );
        const actStart =
          calResult.rows.length > 0
            ? calResult.rows[0].start_date
            : startDateSmr;

        const actualStart = new Date(actStart);
        const actualEnd = new Date(actStart);
        actualEnd.setDate(actualEnd.getDate() + bestContractor.offer_days);

        await client.query(
          `
          INSERT INTO staff_allocation_result (work_type_id, work_vol_unit, cont_id, final_days, actual_start, actual_end, final_cost)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
          [
            lp.work_type_id,
            volUnit,
            bestContractor.cont_id,
            bestContractor.offer_days,
            actualStart.toISOString().substring(0, 10),
            actualEnd.toISOString().substring(0, 10),
            bestContractor.offer_cost,
          ],
        );
        console.log(
          `  -> [УСПЕХ] Назначен подрядчик "${bestContractor.org_name}" на работу ID: ${lp.work_type_id}`,
        );
      } else {
        console.log(
          `  -> [ПРЕДУПРЕЖДЕНИЕ] Подходящий подрядчик для специальности "${lp.specialty}" не найден по лимитам времени/людей!`,
        );
      }
    }
    console.log(`[ЗАДАЧА 4] Распределение подрядчиков успешно рассчитано`);

    await writeAuditLog(
      req,
      "CALCULATE",
      "outputs",
      `Выполнен сквозной расчет планирования СМР для строительного объекта ID: ${pprId}`,
    );

    await client.query("COMMIT");
    console.log(`[УСПЕХ] Все 4 задачи успешно рассчитаны и сохранены в БД!`);
    res.json({ success: true });

    await client.query("COMMIT");
    console.log(`[УСПЕХ] Все 4 задачи успешно рассчитаны и сохранены в БД!`);
    res.json({ success: true });
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error(`[ОШИБКА] Расчет прерван и откачен:`, err.message);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;
