import React, { useState } from "react";
import styles from "./Directories.module.scss";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { DataTable } from "../../components/DataTable/DataTable"; // Импортируем наш универсальный компонент
import type { ConsumptionNorm, LaborNorm } from "../../types/entities";
import {
  initialConsumptionNorms,
  initialLaborNorms,
} from "../../types/mockData";

type TabType = "materials" | "labor";

export const Directories: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("materials");

  // Массивы данных в стейте
  const [materials, setMaterials] = useState<ConsumptionNorm[]>(
    initialConsumptionNorms,
  );
  const [labor, setLabor] = useState<LaborNorm[]>(initialLaborNorms);

  // ID выбранной кликом строки
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Состояния модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Поля ввода модального окна
  const [matCategory, setMatCategory] = useState("");
  const [matWorkType, setMatWorkType] = useState("");
  const [matCoeff, setMatCoeff] = useState("");
  const [matRationale, setMatRationale] = useState("");

  const [labWorkType, setLabWorkType] = useState("");
  const [labSpecialty, setLabSpecialty] = useState("");
  const [labRank, setLabRank] = useState("");
  const [labNorm, setLabNorm] = useState("");

  // Переключение вкладок (сбрасывает выбор строки)
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedId(null);
  };

  const handleRowClick = (id: number) => {
    setSelectedId(selectedId === id ? null : id);
  };

  // 1. УДАЛЕНИЕ ВЫБРАННОЙ СТРОКИ
  const handleDeleteSelected = () => {
    if (selectedId === null) return;

    if (activeTab === "materials") {
      setMaterials(materials.filter((item) => item.Norm_ID !== selectedId));
    } else {
      setLabor(labor.filter((item) => item.Norm_ID !== selectedId));
    }
    setSelectedId(null);
  };

  // 2. ОТКРЫТИЕ ДЛЯ ДОБАВЛЕНИЯ
  const handleOpenAdd = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
    setMatCategory("");
    setMatWorkType("");
    setMatCoeff("");
    setMatRationale("");
    setLabWorkType("");
    setLabSpecialty("");
    setLabRank("");
    setLabNorm("");
  };

  // 3. ОТКРЫТИЕ ДЛЯ РЕДАКТИРОВАНИЯ ВЫБРАННОЙ СТРОКИ
  const handleOpenEditSelected = () => {
    if (selectedId === null) return;
    setIsEditMode(true);
    setIsModalOpen(true);

    if (activeTab === "materials") {
      const item = materials.find((m) => m.Norm_ID === selectedId);
      if (item) {
        setMatCategory(item.Res_Category);
        setMatWorkType(item.Work_Type);
        setMatCoeff(item.Coeff_K.toString());
        setMatRationale(item.Rationale || "");
      }
    } else {
      const item = labor.find((l) => l.Norm_ID === selectedId);
      if (item) {
        setLabWorkType(item.Work_Type);
        setLabSpecialty(item.Specialty);
        setLabRank(item.Rank.toString());
        setLabNorm(item.ManHour_Norm.toString());
      }
    }
  };

  // 4. СОХРАНЕНИЕ
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "materials") {
      if (isEditMode && selectedId !== null) {
        setMaterials(
          materials.map((m) =>
            m.Norm_ID === selectedId
              ? {
                  Norm_ID: selectedId,
                  Res_Category: matCategory,
                  Work_Type: matWorkType,
                  Coeff_K: parseFloat(matCoeff) || 0,
                  Rationale: matRationale || null,
                }
              : m,
          ),
        );
      } else {
        const newId =
          materials.length > 0
            ? Math.max(...materials.map((m) => m.Norm_ID)) + 1
            : 1;
        setMaterials([
          ...materials,
          {
            Norm_ID: newId,
            Res_Category: matCategory,
            Work_Type: matWorkType,
            Coeff_K: parseFloat(matCoeff) || 0,
            Rationale: matRationale || null,
          },
        ]);
      }
    } else {
      if (isEditMode && selectedId !== null) {
        setLabor(
          labor.map((l) =>
            l.Norm_ID === selectedId
              ? {
                  Norm_ID: selectedId,
                  Work_Type: labWorkType,
                  Specialty: labSpecialty,
                  Rank: parseInt(labRank) || 1,
                  ManHour_Norm: parseFloat(labNorm) || 0,
                }
              : l,
          ),
        );
      } else {
        const newId =
          labor.length > 0 ? Math.max(...labor.map((l) => l.Norm_ID)) + 1 : 1;
        setLabor([
          ...labor,
          {
            Norm_ID: newId,
            Work_Type: labWorkType,
            Specialty: labSpecialty,
            Rank: parseInt(labRank) || 1,
            ManHour_Norm: parseFloat(labNorm) || 0,
          },
        ]);
      }
    }

    setIsModalOpen(false);
    setSelectedId(null);
  };

  return (
    <div className={styles.container}>
      {/* Вкладки переключения */}
      <div className={styles.tabsHeader}>
        <button
          onClick={() => handleTabChange("materials")}
          className={
            activeTab === "materials"
              ? styles.activeTabButton
              : styles.tabButton
          }
        >
          Нормы расхода материалов
        </button>
        <button
          onClick={() => handleTabChange("labor")}
          className={
            activeTab === "labor" ? styles.activeTabButton : styles.tabButton
          }
        >
          Трудовые нормативы
        </button>
      </div>

      {/* Панель инструментов сверху */}
      <div className={styles.toolbar}>
        <button onClick={handleOpenAdd} className={styles.addBtn}>
          <Plus size={14} />
          Добавить новую норму
        </button>
        <button
          onClick={handleOpenEditSelected}
          disabled={selectedId === null}
          className={styles.editBtn}
        >
          <Edit3 size={14} />
          Изменить
        </button>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedId === null}
          className={styles.deleteBtn}
        >
          <Trash2 size={14} />
          Удалить выбранную
        </button>
        {selectedId !== null && (
          <span
            style={{
              fontSize: "0.75rem",
              color: "#64748b",
              marginLeft: "auto",
            }}
          >
            Выбрана строка с ID: {selectedId}
          </span>
        )}
      </div>

      {/* ОТОБРАЖЕНИЕ ТАБЛИЦ ЧЕРЕЗ УНИВЕРСАЛЬНЫЙ КОМПОНЕНТ DATATABLE */}

      {activeTab === "materials" && (
        <DataTable
          title="Нормы расхода материалов"
          headers={[
            "ID",
            "Категория ресурса",
            "Применимый вид работ",
            "Коэффициент расхода (К)",
            "Обоснование",
          ]}
          data={materials}
          columns={[
            "Norm_ID",
            "Res_Category",
            "Work_Type",
            "Coeff_K",
            (item) => item.Rationale || "—",
          ]}
          idField="Norm_ID"
          selectedId={selectedId}
          onRowClick={handleRowClick}
        />
      )}

      {activeTab === "labor" && (
        <DataTable
          title="Трудовые нормативы и специальности"
          headers={[
            "ID",
            "Вид работ / Категория",
            "Специальность",
            "Разряд",
            "Норма (чел-час/ед)",
          ]}
          data={labor}
          columns={[
            "Norm_ID",
            "Work_Type",
            "Specialty",
            "Rank",
            "ManHour_Norm",
          ]}
          idField="Norm_ID"
          selectedId={selectedId}
          onRowClick={handleRowClick}
        />
      )}

      {/* ВСПЛЫВАЮЩЕЕ МОДАЛЬНОЕ ОКНО ДОБАВЛЕНИЯ / РЕДАКТИРОВАНИЯ */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h4>
                {isEditMode ? "Редактирование нормы" : "Добавление новой нормы"}
              </h4>
            </div>
            <form onSubmit={handleSave}>
              <div className={styles.modalBody}>
                {activeTab === "materials" ? (
                  <>
                    <div className={styles.formGroup}>
                      <label>Категория ресурса</label>
                      <input
                        type="text"
                        required
                        value={matCategory}
                        onChange={(e) => setMatCategory(e.target.value)}
                        placeholder="Например, Бетон тяжелый"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Вид работ / Технология</label>
                      <input
                        type="text"
                        required
                        value={matWorkType}
                        onChange={(e) => setMatWorkType(e.target.value)}
                        placeholder="Например, Общестроительные"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Коэффициент расхода (К)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={matCoeff}
                        onChange={(e) => setMatCoeff(e.target.value)}
                        placeholder="1.02"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Обоснование</label>
                      <input
                        type="text"
                        value={matRationale}
                        onChange={(e) => setMatRationale(e.target.value)}
                        placeholder="Например, ГОСТ или регламент"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.formGroup}>
                      <label>Вид работ / Категория</label>
                      <input
                        type="text"
                        required
                        value={labWorkType}
                        onChange={(e) => setLabWorkType(e.target.value)}
                        placeholder="Например, Общестроительные"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Специальность</label>
                      <input
                        type="text"
                        required
                        value={labSpecialty}
                        onChange={(e) => setLabSpecialty(e.target.value)}
                        placeholder="Например, Арматурщик"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Разряд</label>
                      <input
                        type="number"
                        required
                        value={labRank}
                        onChange={(e) => setLabRank(e.target.value)}
                        placeholder="4"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Норма (чел-час/ед)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={labNorm}
                        onChange={(e) => setLabNorm(e.target.value)}
                        placeholder="20.0"
                      />
                    </div>
                  </>
                )}

                {/* Кнопки управления */}
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
