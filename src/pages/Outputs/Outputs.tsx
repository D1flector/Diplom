import React, { useState } from "react";
import styles from "./Outputs.module.scss";
import {
  Calendar,
  Truck,
  Users,
  UserCheck,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

type TaskID = 1 | 2 | 3 | 4;

export const Outputs: React.FC = () => {
  const [activeTask, setActiveTask] = useState<TaskID | null>(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const tasks = [
    {
      id: 1 as TaskID,
      name: "Календарный график СМР",
      icon: <Calendar size={26} />,
      styleClass: styles.iconBlue,
    },
    {
      id: 2 as TaskID,
      name: "Ведомость потребности в МТР",
      icon: <Truck size={26} />,
      styleClass: styles.iconOrange,
    },
    {
      id: 3 as TaskID,
      name: "Кадровая потребность",
      icon: <Users size={26} />,
      styleClass: styles.iconGreen,
    },
    {
      id: 4 as TaskID,
      name: "Расстановка подрядчиков",
      icon: <UserCheck size={26} />,
      styleClass: styles.iconPurple,
    },
  ];

  // Запуск имитации расчета
  const handleOpenReport = (id: TaskID) => {
    setLoading(true);
    setActiveTask(id);
    setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 секунда анимации расчетов
  };

  // Имитация экспорта отчета
  const handleExport = (format: "Excel" | "PDF") => {
    setToastMessage(
      `Документ успешно экспортирован в формате ${format} (.${format === "Excel" ? "xlsx" : "pdf"})`,
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className={styles.container}>
      {/* ВСПЛЫВАЮЩЕЕ УВЕДОМЛЕНИЕ О БЕЗОШИБОЧНОМ ЭКСПОРТЕ */}
      {toastMessage && (
        <div className={styles.toast}>
          <CheckCircle2 size={16} className={styles.toastIcon} />
          {toastMessage}
        </div>
      )}

      {/* СЕТКА ИЗ 4 КАРТОЧЕК ЗАДАЧ */}
      <div className={styles.grid}>
        {tasks.map((task) => (
          <div key={task.id} className={styles.card}>
            <div className={task.styleClass}>{task.icon}</div>
            <h3 className={styles.cardTitle}>{task.name}</h3>
            <button
              onClick={() => handleOpenReport(task.id)}
              className={styles.cardButton}
            >
              Запустить расчет и открыть
            </button>
          </div>
        ))}
      </div>

      {/* ВСПЛЫВАЮЩЕЕ ШИРОКОЕ ОКНО ПРЕДПРОСМОТРА ОТЧЕТА */}
      {activeTask !== null && (
        <div className={styles.modalOverlay}>
          <div className={styles.reportCard}>
            {/* ШАПКА ОКНА ПРЕДПРОСМОТРА */}
            <div className={styles.reportHeader}>
              <h4>
                {loading
                  ? "Расчет параметров плана..."
                  : `Предпросмотр документа: ${tasks.find((t) => t.id === activeTask)?.name}`}
              </h4>

              {/* Кнопки экспорта (показываем только когда расчет завершен) */}
              {!loading && (
                <div className={styles.exportGroup}>
                  <button
                    onClick={() => handleExport("Excel")}
                    className={styles.exportBtn}
                  >
                    <FileSpreadsheet size={14} />
                    Скачать Excel
                  </button>
                  <button
                    onClick={() => handleExport("PDF")}
                    className={styles.exportBtn}
                  >
                    <FileText size={14} />
                    Скачать PDF
                  </button>
                </div>
              )}
            </div>

            {/* ТЕЛО ОКНА ПРЕДПРОСМОТРА */}
            <div className={styles.reportBody}>
              {loading ? (
                // Анимация загрузки расчетов
                <div className={styles.loader}>
                  <div className={styles.spinner} />
                  Математический расчет выходных параметров СМР...
                </div>
              ) : (
                // Результаты расчетов (Таблицы)
                <div>
                  {activeTask === 1 && (
                    <div className={styles.tableWrapper}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>№ п/п</th>
                            <th>Наименование работ</th>
                            <th style={{ textAlign: "right" }}>
                              Всего чел/час
                            </th>
                            <th style={{ textAlign: "right" }}>
                              Кол-во человек
                            </th>
                            <th style={{ textAlign: "right" }}>
                              Кол-во рабочих дней
                            </th>
                            <th>Дата начала</th>
                            <th>Дата окончания</th>
                            <th>Статус</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td style={{ color: "#ffffff", fontWeight: 500 }}>
                              Подготовительные
                            </td>
                            <td style={{ textAlign: "right" }}>40.00</td>
                            <td style={{ textAlign: "right" }}>1</td>
                            <td style={{ textAlign: "right" }}>5</td>
                            <td>20.03.2026</td>
                            <td>24.03.2026</td>
                            <td className={styles.statusSuccess}>
                              В рамках лимита
                            </td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td style={{ color: "#ffffff", fontWeight: 500 }}>
                              Общестроительные
                            </td>
                            <td style={{ textAlign: "right" }}>900.00</td>
                            <td style={{ textAlign: "right" }}>5</td>
                            <td style={{ textAlign: "right" }}>15</td>
                            <td>25.03.2026</td>
                            <td>08.04.2026</td>
                            <td className={styles.statusSuccess}>
                              В рамках лимита
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTask === 2 && (
                    <div className="pageText">
                      Расчет потребности в материально-технических ресурсах
                      (МТР) находится в разработке...
                    </div>
                  )}

                  {activeTask === 3 && (
                    <div className="pageText">
                      Расчет нормативной кадровой потребности находится в
                      разработке...
                    </div>
                  )}

                  {activeTask === 4 && (
                    <div className="pageText">
                      Алгоритм многофакторной оптимизации расстановки
                      подрядчиков находится в разработке...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ПОДВАЛ ОКНА (КНОПКА ЗАКРЫТЬ) */}
            <div className={styles.modalFooter}>
              <button
                onClick={() => setActiveTask(null)}
                className={styles.cancelBtn}
                disabled={loading}
              >
                Закрыть предпросмотр
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
