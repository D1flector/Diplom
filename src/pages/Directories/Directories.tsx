import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchMtrNorms,
  fetchLaborNorms,
  addMtrNorm,
  updateMtrNorm,
  deleteMtrNorm,
  addLaborNorm,
  updateLaborNorm,
  deleteLaborNorm,
} from "../../store/slices/directorySlice";
import { DataTable } from "../../components/DataTable/DataTable";
import { Plus, Edit3, Trash2 } from "lucide-react";
import styles from "./Directories.module.scss";

type TabType = "mtr" | "labor";

export const Directories: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("mtr");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const dispatch = useAppDispatch();

  // Получаем списки из Redux
  const { mtrNorms, laborNorms, loading } = useAppSelector(
    (state) => state.directory,
  );

  // Стейты управления модальным окном
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Поля ввода для МТР
  const [mtrWorkName, setMtrWorkName] = useState("");
  const [mtrResCategory, setMtrResCategory] = useState("");
  const [mtrCoeffK, setMtrCoeffK] = useState("");
  const [mtrRationale, setMtrRationale] = useState("");

  // Поля ввода для норм труда
  const [labWorkName, setLabWorkName] = useState("");
  const [labSpecialty, setLabSpecialty] = useState("");
  const [labRank, setLabRank] = useState("1");
  const [labManhourNorm, setLabManhourNorm] = useState("");

  useEffect(() => {
    dispatch(fetchMtrNorms());
    dispatch(fetchLaborNorms());
  }, [dispatch]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedId(null);
  };

  const handleRowClick = (id: number) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const handleDeleteSelected = () => {
    if (selectedId === null) return;
    if (activeTab === "mtr") {
      dispatch(deleteMtrNorm(selectedId));
    } else {
      dispatch(deleteLaborNorm(selectedId));
    }
    setSelectedId(null);
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setIsModalOpen(true);

    // Сброс МТР
    setMtrWorkName("");
    setMtrResCategory("");
    setMtrCoeffK("");
    setMtrRationale("");

    // Сброс норм труда
    setLabWorkName("");
    setLabSpecialty("");
    setLabRank("1");
    setLabManhourNorm("");
  };

  const handleOpenEditSelected = () => {
    if (selectedId === null) return;
    setIsEditMode(true);
    setIsModalOpen(true);

    if (activeTab === "mtr") {
      const item = mtrNorms.find((n) => n.norm_id === selectedId);
      if (item) {
        setMtrWorkName(item.work_name);
        setMtrResCategory(item.res_category);
        setMtrCoeffK(item.coeff_k.toString());
        setMtrRationale(item.rationale || "");
      }
    } else {
      const item = laborNorms.find((n) => n.norm_id === selectedId);
      if (item) {
        setLabWorkName(item.work_name);
        setLabSpecialty(item.specialty);
        setLabRank(item.rank.toString());
        setLabManhourNorm(item.manhour_norm.toString());
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "mtr") {
      const payload = {
        work_name: mtrWorkName,
        res_category: mtrResCategory,
        coeff_k: parseFloat(mtrCoeffK) || 0,
        rationale: mtrRationale || "",
      };

      if (isEditMode && selectedId !== null) {
        dispatch(updateMtrNorm({ id: selectedId, data: payload }));
      } else {
        dispatch(addMtrNorm(payload));
      }
    } else {
      const payload = {
        work_name: labWorkName,
        specialty: labSpecialty,
        rank: parseInt(labRank) || 1,
        manhour_norm: parseFloat(labManhourNorm) || 0,
      };

      if (isEditMode && selectedId !== null) {
        dispatch(updateLaborNorm({ id: selectedId, data: payload }));
      } else {
        dispatch(addLaborNorm(payload));
      }
    }

    setIsModalOpen(false);
    setSelectedId(null);
  };

  const mtrConfig = {
    title: "Справочник норм расхода материально-технических ресурсов (МТР)",
    headers: [
      "ID",
      "Вид работ",
      "Материал / Категория ресурса",
      "Коэфф. К",
      "Обоснование",
    ],
    columns: [
      "norm_id",
      "work_name",
      "res_category",
      // Исправлено здесь: преобразуем к числу перед вызовом toFixed
      (item: any) => {
        const val = Number(item.coeff_k);
        return isNaN(val) ? "0.0000" : val.toFixed(4);
      },
      (item: any) => item.rationale || "—",
    ],
    idField: "norm_id",
  };

  const laborConfig = {
    title: "Справочник норм затрат труда рабочих по специальностям",
    headers: ["ID", "Вид работ", "Специальность", "Разряд", "Норма (чел-ч)"],
    columns: ["norm_id", "work_name", "specialty", "rank", "manhour_norm"],
    idField: "norm_id",
  };

  const currentConfig = activeTab === "mtr" ? mtrConfig : laborConfig;
  const currentData = activeTab === "mtr" ? mtrNorms : laborNorms;

  return (
    <div className={styles.container}>
      {/* Шапка вкладок */}
      <div className={styles.tabsHeader}>
        <button
          onClick={() => handleTabChange("mtr")}
          className={
            activeTab === "mtr" ? styles.activeTabButton : styles.tabButton
          }
        >
          Нормы расхода МТР
        </button>
        <button
          onClick={() => handleTabChange("labor")}
          className={
            activeTab === "labor" ? styles.activeTabButton : styles.tabButton
          }
        >
          Трудовые нормы
        </button>
      </div>

      {/* Панель инструментов */}
      <div className={styles.toolbar}>
        <button onClick={handleOpenAdd} className={styles.addBtn}>
          <Plus size={14} /> Добавить строку
        </button>
        <button
          onClick={handleOpenEditSelected}
          disabled={selectedId === null}
          className={styles.editBtn}
        >
          <Edit3 size={14} /> Изменить
        </button>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedId === null}
          className={styles.deleteBtn}
        >
          <Trash2 size={14} /> Удалить
        </button>
        {selectedId !== null && (
          <span
            style={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              marginLeft: "auto",
            }}
          >
            Выбрана строка с ID: {selectedId}
          </span>
        )}
      </div>

      {/* Таблица */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loader}>Загрузка нормативных данных...</div>
        ) : (
          <DataTable
            title={currentConfig.title}
            headers={currentConfig.headers}
            data={currentData || []}
            columns={currentConfig.columns}
            idField={currentConfig.idField}
            selectedId={selectedId}
            onRowClick={handleRowClick}
          />
        )}
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h4>
                {isEditMode
                  ? "Редактирование норматива"
                  : "Добавление нового норматива"}
              </h4>
            </div>
            <form onSubmit={handleSave}>
              <div className={styles.modalBody}>
                {/* Форма для норм расхода МТР */}
                {activeTab === "mtr" && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Наименование вида работ</label>
                      <input
                        type="text"
                        required
                        value={mtrWorkName}
                        onChange={(e) => setMtrWorkName(e.target.value)}
                        placeholder="Например, Разработка грунта"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Категория ресурса / Материал</label>
                      <input
                        type="text"
                        required
                        value={mtrResCategory}
                        onChange={(e) => setMtrResCategory(e.target.value)}
                        placeholder="Например, Песок строительный"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Коэффициент расхода (К)</label>
                      <input
                        type="number"
                        step="0.0001"
                        required
                        value={mtrCoeffK}
                        onChange={(e) => setMtrCoeffK(e.target.value)}
                        placeholder="Например, 1.04"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Обоснование</label>
                      <input
                        type="text"
                        value={mtrRationale}
                        onChange={(e) => setMtrRationale(e.target.value)}
                        placeholder="Например, ГЭСН 01-01-001"
                      />
                    </div>
                  </>
                )}

                {/* Форма для норм труда */}
                {activeTab === "labor" && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Наименование вида работ</label>
                      <input
                        type="text"
                        required
                        value={labWorkName}
                        onChange={(e) => setLabWorkName(e.target.value)}
                        placeholder="Например, Кирпичная кладка"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Специальность</label>
                      <input
                        type="text"
                        required
                        value={labSpecialty}
                        onChange={(e) => setLabSpecialty(e.target.value)}
                        placeholder="Например, Каменщик"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Разряд</label>
                      <select
                        value={labRank}
                        onChange={(e) => setLabRank(e.target.value)}
                      >
                        <option value="1">1 разряд</option>
                        <option value="2">2 разряд</option>
                        <option value="3">3 разряд</option>
                        <option value="4">4 разряд</option>
                        <option value="5">5 разряд</option>
                        <option value="6">6 разряд</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Норма затрат труда (чел.-ч)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={labManhourNorm}
                        onChange={(e) => setLabManhourNorm(e.target.value)}
                        placeholder="Например, 0.85"
                      />
                    </div>
                  </>
                )}

                {/* Подвал с кнопками */}
                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={styles.cancelBtn}
                  >
                    Отмена
                  </button>
                  <button type="submit" className={styles.saveBtn}>
                    Сохранить
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
