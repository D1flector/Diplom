import React, { useState } from "react";
import styles from "./Outputs.module.scss";
import * as XLSX from "xlsx";
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

// Импорт моковых данных
import {
  initialWorkVolumes,
  initialWorkTypes,
  initialProjectSpec,
  initialConsumptionNorms,
  initialLaborNorms,
  initialContractors,
} from "../../types/mockData";

type TaskID = 1 | 2 | 3 | 4;

export const Outputs: React.FC = () => {
  const [activeTask, setActiveTask] = useState<TaskID | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

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

  const handleRun = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsCalculated(true);
    }, 1000);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ФУНКЦИЯ РЕАЛЬНОГО ЭКСПОРТА ВСЕХ ДАННЫХ В EXCEL
  const exportToExcel = (id: TaskID) => {
    let exportData: any[] = [];
    const taskName = tasks.find((t) => t.id === id)?.name || "Otchet";

    if (id === 1) {
      exportData = initialWorkVolumes.map((v, i) => {
        const type = initialWorkTypes.find((t) => t.Work_name === v.Work_name);
        return {
          "№ п/п": i + 1,
          "Наименование работ": v.Work_name,
          "Всего чел/час": (
            (type?.Staff_Qty || 1) *
            v.Duration_Days *
            8
          ).toFixed(2),
          "Кол-во чел": type?.Staff_Qty || 0,
          Дней: v.Duration_Days,
          "Дата начала": i === 0 ? "20.03.2026" : "25.03.2026",
          "Дата окончания": i === 0 ? "24.03.2026" : "08.04.2026",
        };
      });
    } else if (id === 2) {
      exportData = initialProjectSpec.map((s, i) => {
        const norm = initialConsumptionNorms.find(
          (n) => n.Res_Category === s.Material_Name,
        );
        return {
          "№ п/п": i + 1,
          "Наименование материала": s.Material_Name,
          "Ед. изм.": s.Unit,
          "Расчетный объем": (s.Proj_Vol * (norm?.Coeff_K || 1)).toFixed(2),
          "Дата поставки": "20.03.2026",
          "Этап ГПР": norm?.Work_Type || "Общестроительные",
        };
      });
    } else if (id === 3) {
      exportData = initialLaborNorms.map((n, i) => {
        const vol = initialWorkVolumes.find((v) => v.Work_name === n.Work_Type);
        const hours = (vol?.Volume || 0) * n.ManHour_Norm;
        return {
          "№ п/п": i + 1,
          "Вид работ": n.Work_Type,
          Специальность: n.Specialty,
          "Срок (дн)": vol?.Duration_Days || 0,
          "Трудоемкость (чел-час)": hours.toFixed(2),
          "Численность (чел)": Math.ceil(
            hours / ((vol?.Duration_Days || 1) * 8),
          ),
        };
      });
    } else if (id === 4) {
      exportData = initialWorkVolumes.map((v, i) => {
        const contr = initialContractors[i % initialContractors.length];
        return {
          "№ п/п": i + 1,
          Работа: v.Work_name,
          Объем: v.Volume,
          Подрядчик: contr.Org_Name,
          Срок: contr.Offer_Days,
          Начало: "25.03",
          Конец: "03.04",
          "Стоимость (руб)": contr.Offer_Cost,
        };
      });
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
              setIsCalculated(false);
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
                  onClick={() => setActiveTask(null)}
                  className={styles.closeBtn}
                >
                  <ArrowLeft size={18} />
                </button>
                <span>Предпросмотр документа</span>
              </div>
              <div className={styles.exportGroup}>
                {!isCalculated ? (
                  <button onClick={handleRun} className={styles.runBtn}>
                    <Play size={14} fill="white" /> Рассчитать
                  </button>
                ) : (
                  <>
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

            <div className={styles.reportBody}>
              {loading ? (
                <div className={styles.loaderArea}>
                  <div className={styles.spinner}></div>
                  <h3>Ожидайте...</h3>
                </div>
              ) : isCalculated ? (
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
                      на объекте: ЖК «Северный»
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
                          {initialWorkVolumes.map((v, i) => {
                            const type = initialWorkTypes.find(
                              (t) => t.Work_name === v.Work_name,
                            );
                            const hours = (
                              (type?.Staff_Qty || 1) *
                              v.Duration_Days *
                              8
                            ).toFixed(2);
                            const start = i === 0 ? "20.03.2026" : "25.03.2026";
                            const end = i === 0 ? "24.03.2026" : "08.04.2026";
                            return (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{v.Work_name}</td>
                                <td>{hours}</td>
                                <td>{type?.Staff_Qty}</td>
                                <td>{v.Duration_Days}</td>
                                <td>{start}</td>
                                <td>{end}</td>
                              </tr>
                            );
                          })}
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
                          {initialProjectSpec.map((spec, i) => {
                            const norm = initialConsumptionNorms.find(
                              (n) => n.Res_Category === spec.Material_Name,
                            );
                            return (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{spec.Material_Name}</td>
                                <td>{spec.Unit}</td>
                                <td>
                                  {(
                                    spec.Proj_Vol * (norm?.Coeff_K || 1)
                                  ).toFixed(2)}
                                </td>
                                <td>20.03.2026</td>
                                <td>{norm?.Work_Type || "Общее"}</td>
                              </tr>
                            );
                          })}
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
                          {initialLaborNorms.map((n, i) => {
                            const vol = initialWorkVolumes.find(
                              (v) => v.Work_name === n.Work_Type,
                            );
                            const hours = (vol?.Volume || 0) * n.ManHour_Norm;
                            const count = Math.ceil(
                              hours / ((vol?.Duration_Days || 1) * 8),
                            );
                            return (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{n.Work_Type}</td>
                                <td>{n.Specialty}</td>
                                <td>{vol?.Duration_Days || 0}</td>
                                <td>{hours.toFixed(2)}</td>
                                <td>{count} чел.</td>
                              </tr>
                            );
                          })}
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
                            <th>Срок</th>
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
                          {initialWorkVolumes.map((v, i) => (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{v.Work_name}</td>
                              <td>{v.Volume}</td>
                              <td>{initialContractors[i % 3].Org_Name}</td>
                              <td>10</td>
                              <td>25.03</td>
                              <td>03.04</td>
                              <td>
                                {initialContractors[
                                  i % 3
                                ].Offer_Cost.toLocaleString()}
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
                  Нажмите кнопку «Рассчитать»
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
