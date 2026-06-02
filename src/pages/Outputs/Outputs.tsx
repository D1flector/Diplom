import React, { useState, useEffect } from "react";
import styles from "./Outputs.module.scss";
import * as XLSX from "xlsx";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchPprData } from "../../store/slices/inputsSlice";
import {
  calculateOutputs,
  fetchReportData,
  resetOutputState,
} from "../../store/slices/outputsSlice";
import {
  Calendar,
  Truck,
  Users,
  UserCheck,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Play,
  ArrowLeft,
} from "lucide-react";

type TaskID = 1 | 2 | 3 | 4;

export const Outputs: React.FC = () => {
  const [activeTask, setActiveTask] = useState<TaskID | null>(null);
  const [selectedPprId, setSelectedPprId] = useState<number | "">("");
  const [toast, setToast] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { pprData } = useAppSelector((state) => state.inputs);
  const { reportData, loading, success } = useAppSelector(
    (state) => state.outputs,
  );

  const tasks = [
    {
      id: 1 as TaskID,
      name: "Календарный план выполнения работ на объекте",
      icon: <Calendar size={22} />,
    },
    {
      id: 2 as TaskID,
      name: "Ведомость потребности в материалах (МТР)",
      icon: <Truck size={22} />,
    },
    {
      id: 3 as TaskID,
      name: "Ведомость потребности в трудовых ресурсах",
      icon: <Users size={22} />,
    },
    {
      id: 4 as TaskID,
      name: "План расстановки подрядных организаций",
      icon: <UserCheck size={22} />,
    },
  ];

  useEffect(() => {
    dispatch(fetchPprData());
  }, [dispatch]);

  useEffect(() => {
    if (activeTask && selectedPprId) {
      dispatch(
        fetchReportData({ taskId: activeTask, pprId: Number(selectedPprId) }),
      );
    }
  }, [activeTask, selectedPprId, dispatch]);

  const handleRun = async () => {
    if (!selectedPprId) {
      showToast("Сначала выберите объект строительства");
      return;
    }
    const res = await dispatch(calculateOutputs(Number(selectedPprId)));
    if (res.meta.requestStatus === "fulfilled" && activeTask) {
      dispatch(
        fetchReportData({ taskId: activeTask, pprId: Number(selectedPprId) }),
      );
      showToast("Расчеты успешно обновлены");
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const getSelectedObjectName = () => {
    const obj = pprData.find((p) => p.ppr_id === Number(selectedPprId));
    return obj ? obj.object_name : "—";
  };

  const exportToExcel = (id: TaskID) => {
    if (reportData.length === 0) return;
    const taskName = tasks.find((t) => t.id === id)?.name || "Otchet";
    let exportData: any[] = [];

    if (id === 1) {
      exportData = reportData.map((item, i) => ({
        "№ п/п": i + 1,
        "Наименование работ": item.work_name,
        "Всего чел/час": Number(item.total_manhours).toFixed(2),
        "Кол-во чел": item.staff_qty,
        Дней: item.work_days,
        "Дата начала": new Date(item.start_date).toLocaleDateString(),
        "Дата окончания": new Date(item.end_date).toLocaleDateString(),
      }));
    } else if (id === 2) {
      exportData = reportData.map((item, i) => ({
        "№ п/п": i + 1,
        "Наименование материала": item.mat_name,
        "Ед. изм.": item.unit,
        "Расчетный объем": Number(item.req_volume).toFixed(2),
        "Дата поставки": new Date(item.delivery_date).toLocaleDateString(),
        "Этап ГПР": item.stage_link,
      }));
    } else if (id === 3) {
      exportData = reportData.map((item, i) => ({
        "№ п/п": i + 1,
        "Вид работ": item.work_name,
        Специальность: item.specialty,
        "Срок (дн)": item.work_days,
        "Трудоемкость (чел-час)": Number(item.total_hours).toFixed(2),
        "Численность (чел)": item.staff_count,
      }));
    } else if (id === 4) {
      exportData = reportData.map((item, i) => ({
        "№ п/п": i + 1,
        Работа: item.work_name,
        Объем: item.work_vol_unit,
        Подрядчик: item.assigned_org || "Не назначен",
        Срок: item.final_days,
        Начало: new Date(item.actual_start).toLocaleDateString(),
        Конец: new Date(item.actual_end).toLocaleDateString(),
        "Стоимость (руб)": Number(item.final_cost).toLocaleString(),
      }));
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Результаты расчета");
    XLSX.writeFile(wb, `MSU1_${taskName}.xlsx`);
    showToast("Файл Excel успешно сформирован");
  };

  return (
    <div className={styles.container}>
      {toast && (
        <div className={styles.toast}>
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}

      <h1 className={styles.pageTitle}>
        Выходные документы системы управления
      </h1>

      <div className={styles.grid}>
        {tasks.map((t) => (
          <div
            key={t.id}
            className={styles.card}
            onClick={() => {
              setActiveTask(t.id);
              dispatch(resetOutputState());
            }}
          >
            <div className={styles.iconBox}>{t.icon}</div>
            <div className={styles.cardTitle}>{t.name}</div>
            <span className={styles.cardLink}>Открыть →</span>
          </div>
        ))}
      </div>

      {activeTask !== null && (
        <div className={styles.modalOverlay}>
          <div className={styles.reportCard}>
            <div className={styles.reportHeader}>
              <div className={styles.headerTitle}>
                <button
                  onClick={() => {
                    setActiveTask(null);
                    setSelectedPprId("");
                  }}
                  className={styles.closeBtn}
                >
                  <ArrowLeft size={18} />
                </button>
                <span>Предпросмотр документа</span>
              </div>

              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <select
                  required
                  value={selectedPprId}
                  onChange={(e) =>
                    setSelectedPprId(Number(e.target.value) || "")
                  }
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#1e293b",
                    color: "#fff",
                    fontSize: "0.875rem",
                  }}
                >
                  <option value="">-- Выберите объект --</option>
                  {pprData.map((ppr) => (
                    <option key={ppr.ppr_id} value={ppr.ppr_id}>
                      {ppr.object_name}
                    </option>
                  ))}
                </select>

                <div className={styles.exportGroup}>
                  {reportData.length === 0 ? (
                    <button
                      onClick={handleRun}
                      disabled={!selectedPprId}
                      className={styles.runBtn}
                    >
                      <Play size={14} fill="white" /> Рассчитать
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleRun}
                        className={styles.runBtn}
                        style={{
                          marginRight: "10px",
                          backgroundColor: "#0284c7",
                        }}
                      >
                        Пересчитать
                      </button>
                      <button
                        onClick={() => exportToExcel(activeTask)}
                        className={styles.excelBtn}
                      >
                        <FileSpreadsheet size={14} /> Excel
                      </button>
                      <button
                        onClick={() => window.print()}
                        className={styles.pdfBtn}
                      >
                        <FileText size={14} /> Печать PDF
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.reportBody}>
              {loading ? (
                <div className={styles.loaderArea}>
                  <div className={styles.spinner}></div>
                  <h3>Ожидайте, выполняются вычисления...</h3>
                </div>
              ) : reportData.length > 0 ? (
                <div className={styles.paper} id="printable-doc">
                  <div className={styles.docTop}>
                    <div style={{ fontWeight: "bold" }}>АО «МСУ-1»</div>
                    <div style={{ textAlign: "left" }}>
                      Генеральному директору
                      <br />
                      ____________________
                      <br />
                      ____________________
                    </div>
                  </div>

                  <div className={styles.docTitleArea}>
                    <div>
                      {tasks
                        .find((t) => t.id === activeTask)
                        ?.name.toUpperCase()}
                    </div>
                    <div
                      style={{
                        fontSize: "10pt",
                        fontWeight: "normal",
                        marginTop: "4px",
                      }}
                    >
                      на объекте: {getSelectedObjectName()}
                    </div>
                    <div className={styles.underline}></div>
                  </div>

                  <table className={styles.printTable}>
                    {activeTask === 1 && (
                      <>
                        <thead>
                          <tr>
                            <th>№ п/п</th>
                            <th>Наименование работ</th>
                            <th>Всего чел/час</th>
                            <th>Кол-во чел</th>
                            <th>Дней</th>
                            <th>Дата начала</th>
                            <th>Дата окончания</th>
                          </tr>
                          <tr className={styles.numRow}>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                            <td>6</td>
                            <td>7</td>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.map((item, i) => (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{item.work_name}</td>
                              <td>{Number(item.total_manhours).toFixed(2)}</td>
                              <td>{item.staff_qty} чел.</td>
                              <td>{item.work_days} дн.</td>
                              <td>
                                {new Date(item.start_date).toLocaleDateString()}
                              </td>
                              <td>
                                {new Date(item.end_date).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </>
                    )}

                    {activeTask === 2 && (
                      <>
                        <thead>
                          <tr>
                            <th>№ п/п</th>
                            <th>Наименование материала</th>
                            <th>Ед. изм.</th>
                            <th>Объем</th>
                            <th>Дата поставки</th>
                            <th>Этап ГПР</th>
                          </tr>
                          <tr className={styles.numRow}>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                            <td>6</td>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.map((item, i) => (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{item.mat_name}</td>
                              <td>{item.unit}</td>
                              <td>{Number(item.req_volume).toFixed(2)}</td>
                              <td>
                                {new Date(
                                  item.delivery_date,
                                ).toLocaleDateString()}
                              </td>
                              <td>{item.stage_link}</td>
                            </tr>
                          ))}
                        </tbody>
                      </>
                    )}

                    {activeTask === 3 && (
                      <>
                        <thead>
                          <tr>
                            <th>№ п/п</th>
                            <th>Вид работ</th>
                            <th>Требуемая специальность</th>
                            <th>Срок (дн)</th>
                            <th>Трудоемкость</th>
                            <th>Численность</th>
                          </tr>
                          <tr className={styles.numRow}>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                            <td>6</td>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.map((item, i) => (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{item.work_name}</td>
                              <td>{item.specialty}</td>
                              <td>{item.work_days} дн.</td>
                              <td>
                                {Number(item.total_hours).toFixed(2)} чел/час
                              </td>
                              <td>{item.staff_count} чел.</td>
                            </tr>
                          ))}
                        </tbody>
                      </>
                    )}

                    {activeTask === 4 && (
                      <>
                        <thead>
                          <tr>
                            <th>№</th>
                            <th>Работа</th>
                            <th>Объем</th>
                            <th>Подрядчик</th>
                            <th>Срок (дней)</th>
                            <th>Начало</th>
                            <th>Конец</th>
                            <th>Стоимость</th>
                          </tr>
                          <tr className={styles.numRow}>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                            <td>6</td>
                            <td>7</td>
                            <td>8</td>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.map((item, i) => (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{item.work_name}</td>
                              <td>{item.work_vol_unit}</td>
                              <td>{item.assigned_org || "Не назначен"}</td>
                              <td>{item.final_days} дн.</td>
                              <td>
                                {new Date(
                                  item.actual_start,
                                ).toLocaleDateString()}
                              </td>
                              <td>
                                {new Date(item.actual_end).toLocaleDateString()}
                              </td>
                              <td>
                                {Number(item.final_cost).toLocaleString()} руб.
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </>
                    )}
                  </table>

                  <div className={styles.signatureBlock}>
                    <div className={styles.signTitle}>
                      Руководитель отдела ПТО:
                    </div>
                    <div className={styles.signRow}>
                      <div className={styles.lineGroup}>
                        <div className={styles.line}></div>
                        <div className={styles.label}>ФИО</div>
                      </div>
                      <div className={styles.spacer}></div>
                      <div className={styles.lineGroup}>
                        <div className={styles.line}></div>
                        <div className={styles.label}>Подпись</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "#94a3b8",
                    padding: "100px",
                  }}
                >
                  {!selectedPprId
                    ? "Выберите объект строительства для просмотра результатов"
                    : "Нажмите кнопку «Рассчитать» для запуска алгоритмов планирования"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Outputs;
