import React, { useEffect, useState } from "react";
import styles from "./Inputs.module.scss";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { DataTable } from "../../components/DataTable/DataTable";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchPprData,
  addPprData,
  updatePprData,
  deletePprData,
  fetchWorkTypes,
  addWorkType,
  updateWorkType,
  deleteWorkType,
  fetchClientDeadlines,
  addClientDeadline,
  updateClientDeadline,
  deleteClientDeadline,
  fetchWorkVolumes,
  addWorkVolume,
  updateWorkVolume,
  deleteWorkVolume,
  fetchProjectSpecs,
  addProjectSpec,
  updateProjectSpec,
  deleteProjectSpec,
  fetchContractors,
  addContractor,
  updateContractor,
  deleteContractor,
} from "../../store/slices/inputsSlice";

type TabType =
  | "ppr"
  | "works"
  | "deadlines"
  | "volumes"
  | "spec"
  | "contractors";

export const Inputs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("ppr");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const dispatch = useAppDispatch();

  const {
    pprData,
    workTypes,
    clientDeadlines,
    workVolumes,
    projectSpecs,
    contractors,
    loading,
  } = useAppSelector((state) => state.inputs);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [pprObjectName, setPprObjectName] = useState("");
  const [pprResponsiblePerson, setPprResponsiblePerson] = useState("");
  const [pprStartDateSmr, setPprStartDateSmr] = useState("");
  const [pprTechnologyType, setPprTechnologyType] = useState("");

  const [wtName, setWtName] = useState("");
  const [wtComp, setWtComp] = useState("");
  const [wtSpec, setWtSpec] = useState("");
  const [wtStaff, setWtStaff] = useState("");
  const [wtDur, setWtDur] = useState("");

  const [cdPprId, setCdPprId] = useState<number | "">("");
  const [cdStage, setCdStage] = useState("");
  const [cdStart, setCdStart] = useState("");
  const [cdEnd, setCdEnd] = useState("");
  const [cdRigidVal, setCdRigidVal] = useState("Высокая");
  const [cdComment, setCdComment] = useState("");

  const [wvPprId, setWvPprId] = useState<number | "">("");
  const [wvWorkTypeId, setWvWorkTypeId] = useState<number | "">("");
  const [wvVol, setWvVol] = useState("");
  const [wvUnit, setWvUnit] = useState("");
  const [wvDep, setWvDep] = useState("Нет");
  const [wvDays, setWvDays] = useState("");

  const [psPprId, setPsPprId] = useState<number | "">("");
  const [psMat, setPsMat] = useState("");
  const [psChar, setPsChar] = useState("");
  const [psUnit, setPsUnit] = useState("");
  const [psVol, setPsVol] = useState("");

  const [cContract, setCContract] = useState("");
  const [cName, setCName] = useState("");
  const [cContact, setCContact] = useState("");
  const [cSize, setCSize] = useState("");
  const [cDesc, setCDesc] = useState("");
  const [cDays, setCDays] = useState("");
  const [cCost, setCCost] = useState("");

  useEffect(() => {
    dispatch(fetchPprData());
    dispatch(fetchWorkTypes());
    dispatch(fetchClientDeadlines());
    dispatch(fetchWorkVolumes());
    dispatch(fetchProjectSpecs());
    dispatch(fetchContractors());
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

    if (activeTab === "ppr") {
      dispatch(deletePprData(selectedId));
    } else if (activeTab === "works") {
      dispatch(deleteWorkType(selectedId));
    } else if (activeTab === "deadlines") {
      dispatch(deleteClientDeadline(selectedId));
    } else if (activeTab === "volumes") {
      dispatch(deleteWorkVolume(selectedId));
    } else if (activeTab === "spec") {
      dispatch(deleteProjectSpec(selectedId));
    } else if (activeTab === "contractors") {
      dispatch(deleteContractor(selectedId));
    }

    setSelectedId(null);
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
    setErrorMsg(null);

    setPprObjectName("");
    setPprResponsiblePerson("");
    setPprStartDateSmr("");
    setPprTechnologyType("Последовательная");

    setWtName("");
    setWtComp("");
    setWtSpec("");
    setWtStaff("");
    setWtDur("");

    setCdPprId("");
    setCdStage("");
    setCdStart("");
    setCdEnd("");
    setCdRigidVal("Высокая");
    setCdComment("");

    setWvPprId("");
    setWvWorkTypeId("");
    setWvVol("");
    setWvUnit("");
    setWvDep("Нет");
    setWvDays("");

    setPsPprId("");
    setPsMat("");
    setPsChar("");
    setPsUnit("");
    setPsVol("");

    setCContract("");
    setCName("");
    setCContact("");
    setCSize("");
    setCDesc("");
    setCDays("");
    setCCost("");
  };

  const handleOpenEditSelected = () => {
    if (selectedId === null) return;
    setIsEditMode(true);
    setIsModalOpen(true);
    setErrorMsg(null);

    if (activeTab === "ppr") {
      const item = pprData.find((i) => i.ppr_id === selectedId);
      if (item) {
        setPprObjectName(item.object_name);
        setPprResponsiblePerson(item.responsible_person);
        setPprStartDateSmr(
          item.start_date_smr ? item.start_date_smr.substring(0, 10) : "",
        );
        setPprTechnologyType(item.technology_type);
      }
    } else if (activeTab === "works") {
      const item = workTypes.find((i) => i.work_type_id === selectedId);
      if (item) {
        setWtName(item.work_name);
        setWtComp(item.complexity.toString());
        setWtSpec(item.specialists);
        setWtStaff(item.staff_qty.toString());
        setWtDur(item.duration.toString());
      }
    } else if (activeTab === "deadlines") {
      const item = clientDeadlines.find((i) => i.deadline_id === selectedId);
      if (item) {
        setCdPprId(item.ppr_id);
        setCdStage(item.stage_name);
        setCdStart(item.start_date ? item.start_date.substring(0, 10) : "");
        setCdEnd(item.end_date ? item.end_date.substring(0, 10) : "");
        setCdRigidVal(item.rigidity);
        setCdComment(item.comment || "");
      }
    } else if (activeTab === "volumes") {
      const item = workVolumes.find((i) => i.vol_id === selectedId);
      if (item) {
        setWvPprId(item.ppr_id);
        setWvWorkTypeId(item.work_type_id);
        setWvVol(item.volume.toString());
        setWvUnit(item.unit);
        setWvDep(item.dependency || "Нет");
        setWvDays(item.duration_days.toString());
      }
    } else if (activeTab === "spec") {
      const item = projectSpecs.find((i) => i.spec_id === selectedId);
      if (item) {
        setPsPprId(item.ppr_id);
        setPsMat(item.material_name);
        setPsChar(item.characteristics || "");
        setPsUnit(item.unit);
        setPsVol(item.proj_vol.toString());
      }
    } else if (activeTab === "contractors") {
      const item = contractors.find((i) => i.cont_id === selectedId);
      if (item) {
        setCContract(item.contract_id);
        setCName(item.org_name);
        setCContact(item.contact_person || "");
        setCSize(item.team_size.toString());
        setCDesc(item.work_desc);
        setCDays(item.offer_days.toString());
        setCCost(item.offer_cost.toString());
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      if (activeTab === "ppr") {
        const payload = {
          object_name: pprObjectName,
          responsible_person: pprResponsiblePerson,
          start_date_smr: pprStartDateSmr,
          technology_type: pprTechnologyType,
        };
        if (isEditMode && selectedId !== null) {
          await dispatch(
            updatePprData({ id: selectedId, data: payload }),
          ).unwrap();
        } else {
          await dispatch(addPprData(payload)).unwrap();
        }
      } else if (activeTab === "works") {
        const payload = {
          work_name: wtName,
          complexity: parseFloat(wtComp) || 1.0,
          specialists: wtSpec,
          staff_qty: parseInt(wtStaff) || 1,
          duration: parseInt(wtDur) || 1,
        };
        if (isEditMode && selectedId !== null) {
          await dispatch(
            updateWorkType({ id: selectedId, data: payload }),
          ).unwrap();
        } else {
          await dispatch(addWorkType(payload)).unwrap();
        }
      } else if (activeTab === "deadlines") {
        if (!cdPprId)
          throw new Error("Необходимо выбрать наименование объекта");
        if (cdStart && cdEnd && new Date(cdEnd) < new Date(cdStart)) {
          throw new Error("Дата окончания не может быть раньше даты начала");
        }
        const payload = {
          ppr_id: Number(cdPprId),
          stage_name: cdStage,
          start_date: cdStart,
          end_date: cdEnd,
          rigidity: cdRigidVal,
          comment: cdComment || null,
        };
        if (isEditMode && selectedId !== null) {
          await dispatch(
            updateClientDeadline({ id: selectedId, data: payload }),
          ).unwrap();
        } else {
          await dispatch(addClientDeadline(payload)).unwrap();
        }
      } else if (activeTab === "volumes") {
        if (!wvPprId)
          throw new Error("Необходимо выбрать наименование объекта");
        if (!wvWorkTypeId)
          throw new Error("Необходимо выбрать наименование вида работ");
        const payload = {
          ppr_id: Number(wvPprId),
          work_type_id: Number(wvWorkTypeId),
          volume: parseFloat(wvVol) || 0,
          unit: wvUnit,
          dependency: wvDep,
          duration_days: parseInt(wvDays) || 1,
        };
        if (isEditMode && selectedId !== null) {
          await dispatch(
            updateWorkVolume({ id: selectedId, data: payload }),
          ).unwrap();
        } else {
          await dispatch(addWorkVolume(payload)).unwrap();
        }
      } else if (activeTab === "spec") {
        if (!psPprId)
          throw new Error("Необходимо выбрать наименование объекта");
        const payload = {
          ppr_id: Number(psPprId),
          material_name: psMat,
          characteristics: psChar || null,
          unit: psUnit,
          proj_vol: parseFloat(psVol) || 0,
        };
        if (isEditMode && selectedId !== null) {
          await dispatch(
            updateProjectSpec({ id: selectedId, data: payload }),
          ).unwrap();
        } else {
          await dispatch(addProjectSpec(payload)).unwrap();
        }
      } else if (activeTab === "contractors") {
        const payload = {
          contract_id: cContract,
          org_name: cName,
          contact_person: cContact || null,
          team_size: parseInt(cSize) || 1,
          work_desc: cDesc,
          offer_days: parseInt(cDays) || 1,
          offer_cost: parseFloat(cCost) || 0,
        };
        if (isEditMode && selectedId !== null) {
          await dispatch(
            updateContractor({ id: selectedId, data: payload }),
          ).unwrap();
        } else {
          await dispatch(addContractor(payload)).unwrap();
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

  return (
    <div className={styles.container}>
      <div className={styles.tabsHeader}>
        <button
          onClick={() => handleTabChange("ppr")}
          className={
            activeTab === "ppr" ? styles.activeTabButton : styles.tabButton
          }
        >
          Параметры ППР
        </button>
        <button
          onClick={() => handleTabChange("works")}
          className={
            activeTab === "works" ? styles.activeTabButton : styles.tabButton
          }
        >
          Виды работ
        </button>
        <button
          onClick={() => handleTabChange("deadlines")}
          className={
            activeTab === "deadlines"
              ? styles.activeTabButton
              : styles.tabButton
          }
        >
          Директивные сроки
        </button>
        <button
          onClick={() => handleTabChange("volumes")}
          className={
            activeTab === "volumes" ? styles.activeTabButton : styles.tabButton
          }
        >
          Ведомость объемов (ВОР)
        </button>
        <button
          onClick={() => handleTabChange("spec")}
          className={
            activeTab === "spec" ? styles.activeTabButton : styles.tabButton
          }
        >
          Спецификация материалов
        </button>
        <button
          onClick={() => handleTabChange("contractors")}
          className={
            activeTab === "contractors"
              ? styles.activeTabButton
              : styles.tabButton
          }
        >
          Предложения подрядчиков
        </button>
      </div>

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
              color: "#64748b",
              marginLeft: "auto",
            }}
          >
            Выбрана строка с ID: {selectedId}
          </span>
        )}
      </div>

      {loading ? (
        <div
          className={styles.loader}
          style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}
        >
          Загрузка документов проекта...
        </div>
      ) : (
        <>
          {activeTab === "ppr" && (
            <DataTable
              title="Ведомость параметров ППР"
              headers={[
                "№ п/п",
                "Наименование объекта",
                "Ответственное лицо",
                "Дата начала СМР",
                "Технология",
              ]}
              data={pprData || []}
              columns={[
                (item: any) => pprData.indexOf(item) + 1,
                "object_name",
                "responsible_person",
                (item: any) =>
                  item.start_date_smr
                    ? new Date(item.start_date_smr).toLocaleDateString()
                    : "—",
                "technology_type",
              ]}
              idField="ppr_id"
              selectedId={selectedId}
              onRowClick={handleRowClick}
            />
          )}

          {activeTab === "works" && (
            <DataTable
              title="Договорная ведомость видов работ"
              headers={[
                "№ п/п",
                "Вид работ",
                "Сложность",
                "Требуемые специалисты",
                "Кол-во человек",
                "Срок",
              ]}
              data={workTypes || []}
              columns={[
                (item: any) => workTypes.indexOf(item) + 1,
                "work_name",
                (item: any) =>
                  item.complexity
                    ? (Number(item.complexity) || 1.0).toFixed(2)
                    : "—",
                "specialists",
                (item: any) =>
                  item.staff_qty ? `${item.staff_qty} чел.` : "—",
                (item: any) => (item.duration ? `${item.duration} дней` : "—"),
              ]}
              idField="work_type_id"
              selectedId={selectedId}
              onRowClick={handleRowClick}
            />
          )}

          {activeTab === "deadlines" && (
            <DataTable
              title="Требования заказчика по срокам"
              headers={[
                "№ п/п",
                "Наименование объекта",
                "Этап проекта",
                "Дата начала",
                "Дата окончания",
                "Жесткость",
                "Комментарий",
              ]}
              data={clientDeadlines || []}
              columns={[
                (item: any) => clientDeadlines.indexOf(item) + 1,
                (item: any) => item.object_name || "—",
                "stage_name",
                (item: any) =>
                  item.start_date
                    ? new Date(item.start_date).toLocaleDateString()
                    : "—",
                (item: any) =>
                  item.end_date
                    ? new Date(item.end_date).toLocaleDateString()
                    : "—",
                "rigidity",
                (item: any) => item.comment || "—",
              ]}
              idField="deadline_id"
              selectedId={selectedId}
              onRowClick={handleRowClick}
            />
          )}

          {activeTab === "volumes" && (
            <DataTable
              title="Ведомость объемов работ (ВОР)"
              headers={[
                "№ п/п",
                "Наименование объекта",
                "Наименование вида работ",
                "Объем",
                "Ед. изм.",
                "Зависимость",
                "Срок",
              ]}
              data={workVolumes || []}
              columns={[
                (item: any) => workVolumes.indexOf(item) + 1,
                (item: any) => item.object_name || "—",
                (item: any) => item.work_name || "—",
                "volume",
                "unit",
                "dependency",
                (item: any) =>
                  item.duration_days ? `${item.duration_days} дней` : "—",
              ]}
              idField="vol_id"
              selectedId={selectedId}
              onRowClick={handleRowClick}
            />
          )}

          {activeTab === "spec" && (
            <DataTable
              title="Проектная спецификация материалов"
              headers={[
                "№ п/п",
                "Наименование объекта",
                "Наименование ресурса",
                "Характеристика",
                "Ед. изм.",
                "Объем по проекту",
              ]}
              data={projectSpecs || []}
              columns={[
                (item: any) => projectSpecs.indexOf(item) + 1,
                (item: any) => item.object_name || "—",
                "material_name",
                (item: any) => item.characteristics || "—",
                "unit",
                "proj_vol",
              ]}
              idField="spec_id"
              selectedId={selectedId}
              onRowClick={handleRowClick}
            />
          )}

          {activeTab === "contractors" && (
            <DataTable
              title="Список предложений подрядных организаций"
              headers={[
                "№ п/п",
                "№ Договора",
                "Название Подрядчика",
                "Контактное Лицо",
                "Численность бригады",
                "Описание работ",
                "Срок выполнения",
                "Стоимость Работ",
              ]}
              data={contractors || []}
              columns={[
                (item: any) => contractors.indexOf(item) + 1,
                "contract_id",
                "org_name",
                (item: any) => item.contact_person || "—",
                (item: any) =>
                  item.team_size ? `${item.team_size} чел.` : "—",
                "work_desc",
                (item: any) =>
                  item.offer_days ? `${item.offer_days} дней` : "—",
                (item: any) => {
                  const cost = Number(item.offer_cost);
                  if (!item.offer_cost || isNaN(cost)) return "—";
                  return (
                    <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                      {cost.toLocaleString()} руб.
                    </span>
                  );
                },
              ]}
              idField="cont_id"
              selectedId={selectedId}
              onRowClick={handleRowClick}
            />
          )}
        </>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h4>
                {isEditMode
                  ? "Редактирование записи"
                  : "Добавление новой записи"}
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

                {activeTab === "ppr" && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Наименование объекта</label>
                      <input
                        type="text"
                        required
                        value={pprObjectName}
                        onChange={(e) => setPprObjectName(e.target.value)}
                        placeholder="Например, ЖК «Северный»"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Ответственное лицо</label>
                      <input
                        type="text"
                        required
                        value={pprResponsiblePerson}
                        onChange={(e) =>
                          setPprResponsiblePerson(e.target.value)
                        }
                        placeholder="Например, Иванов И.И."
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Дата начала СМР</label>
                      <input
                        type="date"
                        required
                        value={pprStartDateSmr}
                        onChange={(e) => setPprStartDateSmr(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Тип технологии</label>
                      <input
                        type="text"
                        required
                        value={pprTechnologyType}
                        onChange={(e) => setPprTechnologyType(e.target.value)}
                        placeholder="Например, Последовательная"
                      />
                    </div>
                  </>
                )}

                {activeTab === "works" && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Вид работ</label>
                      <input
                        type="text"
                        required
                        value={wtName}
                        onChange={(e) => setWtName(e.target.value)}
                        placeholder="Общестроительные"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Сложность (коэф.)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={wtComp}
                        onChange={(e) => setWtComp(e.target.value)}
                        placeholder="1.50"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Требуемые специалисты</label>
                      <input
                        type="text"
                        required
                        value={wtSpec}
                        onChange={(e) => setWtSpec(e.target.value)}
                        placeholder="Бетонщики"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Кол-во человек</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={wtStaff}
                        onChange={(e) => setWtStaff(e.target.value)}
                        placeholder="5"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Предварительный срок (дней)</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={wtDur}
                        onChange={(e) => setWtDur(e.target.value)}
                        placeholder="15"
                      />
                    </div>
                  </>
                )}

                {activeTab === "deadlines" && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Наименование объекта</label>
                      <select
                        required
                        value={cdPprId}
                        onChange={(e) =>
                          setCdPprId(Number(e.target.value) || "")
                        }
                      >
                        <option value="">-- Выберите объект --</option>
                        {pprData.map((ppr) => (
                          <option key={ppr.ppr_id} value={ppr.ppr_id}>
                            {ppr.object_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Этап проекта</label>
                      <input
                        type="text"
                        required
                        value={cdStage}
                        onChange={(e) => setCdStage(e.target.value)}
                        placeholder="СМР"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Дата начала</label>
                      <input
                        type="date"
                        required
                        value={cdStart}
                        onChange={(e) => setCdStart(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Дата окончания</label>
                      <input
                        type="date"
                        required
                        value={cdEnd}
                        onChange={(e) => setCdEnd(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Жесткость срока</label>
                      <select
                        value={cdRigidVal}
                        onChange={(e) => setCdRigidVal(e.target.value)}
                      >
                        <option value="Высокая">Высокая</option>
                        <option value="Низкая">Низкая</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Комментарий</label>
                      <input
                        type="text"
                        value={cdComment}
                        onChange={(e) => setCdComment(e.target.value)}
                        placeholder="Основной этап"
                      />
                    </div>
                  </>
                )}

                {activeTab === "volumes" && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Наименование объекта</label>
                      <select
                        required
                        value={wvPprId}
                        onChange={(e) =>
                          setWvPprId(Number(e.target.value) || "")
                        }
                      >
                        <option value="">-- Выберите объект --</option>
                        {pprData.map((ppr) => (
                          <option key={ppr.ppr_id} value={ppr.ppr_id}>
                            {ppr.object_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Наименование вида работ</label>
                      <select
                        required
                        value={wvWorkTypeId}
                        onChange={(e) =>
                          setWvWorkTypeId(Number(e.target.value) || "")
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
                      <label>Объем</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={wvVol}
                        onChange={(e) => setWvVol(e.target.value)}
                        placeholder="500"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Ед. изм.</label>
                      <input
                        type="text"
                        required
                        value={wvUnit}
                        onChange={(e) => setWvUnit(e.target.value)}
                        placeholder="м3"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Зависимость</label>
                      <input
                        type="text"
                        required
                        value={wvDep}
                        onChange={(e) => setWvDep(e.target.value)}
                        placeholder="После подготовительных"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Срок (дней)</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={wvDays}
                        onChange={(e) => setWvDays(e.target.value)}
                        placeholder="15"
                      />
                    </div>
                  </>
                )}

                {activeTab === "spec" && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Наименование объекта</label>
                      <select
                        required
                        value={psPprId}
                        onChange={(e) =>
                          setPsPprId(Number(e.target.value) || "")
                        }
                      >
                        <option value="">-- Выберите объект --</option>
                        {pprData.map((ppr) => (
                          <option key={ppr.ppr_id} value={ppr.ppr_id}>
                            {ppr.object_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Наименование ресурса</label>
                      <input
                        type="text"
                        required
                        value={psMat}
                        onChange={(e) => setPsMat(e.target.value)}
                        placeholder="Бетон тяжелый"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Характеристика</label>
                      <input
                        type="text"
                        value={psChar}
                        onChange={(e) => setPsChar(e.target.value)}
                        placeholder="B30 (М400)"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Ед. изм.</label>
                      <input
                        type="text"
                        required
                        value={psUnit}
                        onChange={(e) => setPsUnit(e.target.value)}
                        placeholder="м3"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Объем по проекту</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={psVol}
                        onChange={(e) => setPsVol(e.target.value)}
                        placeholder="600"
                      />
                    </div>
                  </>
                )}

                {activeTab === "contractors" && (
                  <>
                    <div className={styles.formGroup}>
                      <label>№ Договора</label>
                      <input
                        type="text"
                        required
                        value={cContract}
                        onChange={(e) => setCContract(e.target.value)}
                        placeholder="5739"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Название Подрядчика</label>
                      <input
                        type="text"
                        required
                        value={cName}
                        onChange={(e) => setCName(e.target.value)}
                        placeholder="ООО «Монолит-С»"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Контактное Лицо</label>
                      <input
                        type="text"
                        value={cContact}
                        onChange={(e) => setCContact(e.target.value)}
                        placeholder="Петров И.К."
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Численность бригады</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={cSize}
                        onChange={(e) => setCSize(e.target.value)}
                        placeholder="12"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Описание работ</label>
                      <input
                        type="text"
                        required
                        value={cDesc}
                        onChange={(e) => setCDesc(e.target.value)}
                        placeholder="Армирование плиты"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Срок выполнения (дней)</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={cDays}
                        onChange={(e) => setCDays(e.target.value)}
                        placeholder="10"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Стоимость Работ (руб)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={cCost}
                        onChange={(e) => setCCost(e.target.value)}
                        placeholder="500000"
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

export default Inputs;
