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
import { fetchWorkTypes } from "../../store/slices/inputsSlice";
import { DataTable } from "../../components/DataTable/DataTable";
import { Plus, Edit3, Trash2 } from "lucide-react";
import styles from "./Directories.module.scss";

type TabType = "mtr" | "labor";

export const Directories: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("mtr");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const dispatch = useAppDispatch();

  const { mtrNorms, laborNorms, loading } = useAppSelector(
    (state) => state.directory,
  );
  const { workTypes } = useAppSelector((state) => state.inputs);
  const { user } = useAppSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [mtrWorkTypeId, setMtrWorkTypeId] = useState<number | "">("");
  const [mtrResCategory, setMtrResCategory] = useState("");
  const [mtrCoeffK, setMtrCoeffK] = useState("");
  const [mtrRationale, setMtrRationale] = useState("");

  const [labWorkTypeId, setLabWorkTypeId] = useState<number | "">("");
  const [labSpecialty, setLabSpecialty] = useState("");
  const [labRank, setLabRank] = useState("1");
  const [labManhourNorm, setLabManhourNorm] = useState("");

  const isReadOnly =
    user?.role !== "Администратор" && user?.role !== "Руководитель проекта";

  useEffect(() => {
    dispatch(fetchMtrNorms());
    dispatch(fetchLaborNorms());
    dispatch(fetchWorkTypes());
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
    setErrorMsg(null);

    setMtrWorkTypeId("");
    setMtrResCategory("");
    setMtrCoeffK("");
    setMtrRationale("");

    setLabWorkTypeId("");
    setLabSpecialty("");
    setLabRank("1");
    setLabManhourNorm("");
  };

  const handleOpenEditSelected = () => {
    if (selectedId === null) return;
    setIsEditMode(true);
    setIsModalOpen(true);
    setErrorMsg(null);

    if (activeTab === "mtr") {
      const item = mtrNorms.find((n) => n.norm_id === selectedId);
      if (item) {
        setMtrWorkTypeId(item.work_type_id);
        setMtrResCategory(item.res_category);
        setMtrCoeffK(item.coeff_k.toString());
        setMtrRationale(item.rationale || "");
      }
    } else {
      const item = laborNorms.find((n) => n.norm_id === selectedId);
      if (item) {
        setLabWorkTypeId(item.work_type_id);
        setLabSpecialty(item.specialty);
        setLabRank(item.rank.toString());
        setLabManhourNorm(item.manhour_norm.toString());
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      if (activeTab === "mtr") {
        if (!mtrWorkTypeId) throw new Error("Необходимо выбрать вид работ");
        const payload = {
          work_type_id: Number(mtrWorkTypeId),
          res_category: mtrResCategory,
          coeff_k: parseFloat(mtrCoeffK) || 0,
          rationale: mtrRationale || "",
        };

        if (isEditMode && selectedId !== null) {
          await dispatch(
            updateMtrNorm({ id: selectedId, data: payload }),
          ).unwrap();
        } else {
          await dispatch(addMtrNorm(payload)).unwrap();
        }
      } else {
        if (!labWorkTypeId) throw new Error("Необходимо выбрать вид работ");
        const payload = {
          work_type_id: Number(labWorkTypeId),
          specialty: labSpecialty,
          rank: parseInt(labRank) || 1,
          manhour_norm: parseFloat(labManhourNorm) || 0,
        };

        if (isEditMode && selectedId !== null) {
          await dispatch(
            updateLaborNorm({ id: selectedId, data: payload }),
          ).unwrap();
        } else {
          await dispatch(addLaborNorm(payload)).unwrap();
        }
      }

      setIsModalOpen(false);
      setSelectedId(null);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message || "Произошла ошибка базы данных при сохранении.",
      );
    }
  };

  const mtrConfig = {
    title: "Справочник норм расхода материально-технических ресурсов (МТР)",
    headers: [
      "№ п/п",
      "Вид работ",
      "Материал / Категория ресурса",
      "Коэфф. К",
      "Обоснование",
    ],
    columns: [
      (item: any) => mtrNorms.indexOf(item) + 1,
      (item: any) => item.work_name || "—",
      "res_category",
      (item: any) => {
        const val = Number(item.coeff_k);
        return isNaN(val) ? "0.00" : val.toFixed(2);
      },
      (item: any) => item.rationale || "—",
    ],
    idField: "norm_id",
  };

  const laborConfig = {
    title: "Справочник норм затрат труда рабочих по специальностям",
    headers: ["№ п/п", "Вид работ", "Специальность", "Разряд", "Норма (чел-ч)"],
    columns: [
      (item: any) => laborNorms.indexOf(item) + 1,
      (item: any) => item.work_name || "—",
      "specialty",
      "rank",
      "manhour_norm",
    ],
    idField: "norm_id",
  };

  const currentConfig = activeTab === "mtr" ? mtrConfig : laborConfig;
  const currentData = activeTab === "mtr" ? mtrNorms : laborNorms;

  return (
    <div className={styles.container}>
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

      <div className={styles.toolbar}>
        <button
          onClick={handleOpenAdd}
          disabled={isReadOnly}
          className={styles.addBtn}
        >
          <Plus size={14} /> Добавить строку
        </button>
        <button
          onClick={handleOpenEditSelected}
          disabled={selectedId === null || isReadOnly}
          className={styles.editBtn}
        >
          <Edit3 size={14} /> Изменить
        </button>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedId === null || isReadOnly}
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
                {errorMsg && (
                  <div
                    style={{
                      color: "#ef4444",
                      backgroundColor: "#fef2f2",
                      padding: "0.75rem",
                      borderRadius: "0.375rem",
                      marginBottom: "1rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    <strong>Ошибка:</strong> {errorMsg}
                  </div>
                )}

                {activeTab === "mtr" && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Наименование вида работ</label>
                      <select
                        required
                        value={mtrWorkTypeId}
                        onChange={(e) =>
                          setMtrWorkTypeId(Number(e.target.value) || "")
                        }
                      >
                        <option value="">-- Выберите вид работ --</option>
                        {workTypes.map((wt) => (
                          <option key={wt.work_type_id} value={wt.work_type_id}>
                            {wt.work_name}
                          </option>
                        ))}
                      </select>
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
                        step="0.01"
                        min="0"
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

                {activeTab === "labor" && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Наименование вида работ</label>
                      <select
                        required
                        value={labWorkTypeId}
                        onChange={(e) =>
                          setLabWorkTypeId(Number(e.target.value) || "")
                        }
                      >
                        <option value="">-- Выберите вид работ --</option>
                        {workTypes.map((wt) => (
                          <option key={wt.work_type_id} value={wt.work_type_id}>
                            {wt.work_name}
                          </option>
                        ))}
                      </select>
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
                        min="0"
                        required
                        value={labManhourNorm}
                        onChange={(e) => setLabManhourNorm(e.target.value)}
                        placeholder="Например, 0.85"
                      />
                    </div>
                  </>
                )}

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
