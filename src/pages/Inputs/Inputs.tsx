import React, { useState } from "react";
import styles from "./Inputs.module.scss";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { DataTable } from "../../components/DataTable/DataTable";
import type {
  PPRData,
  WorkType,
  ClientDeadline,
  WorkVolume,
  ProjectSpec,
  Contractor,
} from "../../types/entities";
import {
  initialPPRData,
  initialWorkTypes,
  initialClientDeadlines,
  initialWorkVolumes,
  initialProjectSpec,
  initialContractors,
} from "../../types/mockData";

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

  // Стейты списков данных
  const [pprList, setPprList] = useState<PPRData[]>(initialPPRData);
  const [workTypes, setWorkTypes] = useState<WorkType[]>(initialWorkTypes);
  const [deadlines, setDeadlines] = useState<ClientDeadline[]>(
    initialClientDeadlines,
  );
  const [workVolumes, setWorkVolumes] =
    useState<WorkVolume[]>(initialWorkVolumes);
  const [projectSpec, setProjectSpec] =
    useState<ProjectSpec[]>(initialProjectSpec);
  const [contractors, setContractors] =
    useState<Contractor[]>(initialContractors);

  // Стейты модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Поля ввода форм
  const [pprSection, setPprSection] = useState("");
  const [pprParam, setPprParam] = useState("");
  const [pprVal, setPprVal] = useState("");

  const [wtName, setWtName] = useState("");
  const [wtComp, setWtComp] = useState("");
  const [wtSpec, setWtSpec] = useState("");
  const [wtStaff, setWtStaff] = useState("");
  const [wtDur, setWtDur] = useState("");

  const [cdStage, setCdStage] = useState("");
  const [cdStart, setCdStart] = useState("");
  const [cdEnd, setCdEnd] = useState("");
  const [cdRigid, setCdRigid] = useState("Высокая");
  const [cdComment, setCdComment] = useState("");

  const [wvName, setWvName] = useState("");
  const [wvVol, setWvVol] = useState("");
  const [wvUnit, setWvUnit] = useState("");
  const [wvDep, setWvDep] = useState("Нет");
  const [wvDays, setWvDays] = useState("");

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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedId(null);
  };

  const handleRowClick = (id: number) => {
    setSelectedId(selectedId === id ? null : id);
  };

  // Удаление строки
  const handleDeleteSelected = () => {
    if (selectedId === null) return;
    if (activeTab === "ppr")
      setPprList(pprList.filter((i) => i.PPR_ID !== selectedId));
    if (activeTab === "works")
      setWorkTypes(workTypes.filter((i) => i.WorkType_ID !== selectedId));
    if (activeTab === "deadlines")
      setDeadlines(deadlines.filter((i) => i.Deadline_ID !== selectedId));
    if (activeTab === "volumes")
      setWorkVolumes(workVolumes.filter((i) => i.Vol_ID !== selectedId));
    if (activeTab === "spec")
      setProjectSpec(projectSpec.filter((i) => i.Spec_ID !== selectedId));
    if (activeTab === "contractors")
      setContractors(contractors.filter((i) => i.Cont_ID !== selectedId));
    setSelectedId(null);
  };

  // Открытие для добавления
  const handleOpenAdd = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
    setPprSection("");
    setPprParam("");
    setPprVal("");
    setWtName("");
    setWtComp("");
    setWtSpec("");
    setWtStaff("");
    setWtDur("");
    setCdStage("");
    setCdStart("");
    setCdEnd("");
    setCdRigid("Высокая");
    setCdComment("");
    setWvName("");
    setWvVol("");
    setWvUnit("");
    setWvDep("Нет");
    setWvDays("");
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

  // Открытие для редактирования
  const handleOpenEditSelected = () => {
    if (selectedId === null) return;
    setIsEditMode(true);
    setIsModalOpen(true);

    if (activeTab === "ppr") {
      const item = pprList.find((i) => i.PPR_ID === selectedId);
      if (item) {
        setPprSection(item.PPR_Section);
        setPprParam(item.Parameter);
        setPprVal(item.Value);
      }
    } else if (activeTab === "works") {
      const item = workTypes.find((i) => i.WorkType_ID === selectedId);
      if (item) {
        setWtName(item.Work_name);
        setWtComp(item.Complexity.toString());
        setWtSpec(item.Specialists);
        setWtStaff(item.Staff_Qty.toString());
        setWtDur(item.Duration.toString());
      }
    } else if (activeTab === "deadlines") {
      const item = deadlines.find((i) => i.Deadline_ID === selectedId);
      if (item) {
        setCdStage(item.Stage_name);
        setCdStart(item.Start_date);
        setCdEnd(item.End_date);
        setCdRigid(item.Rigidity);
        setCdComment(item.Comment || "");
      }
    } else if (activeTab === "volumes") {
      const item = workVolumes.find((i) => i.Vol_ID === selectedId);
      if (item) {
        setWvName(item.Work_name);
        setWvVol(item.Volume.toString());
        setWvUnit(item.Unit);
        setWvDep(item.Dependency || "Нет");
        setWvDays(item.Duration_Days.toString());
      }
    } else if (activeTab === "spec") {
      const item = projectSpec.find((i) => i.Spec_ID === selectedId);
      if (item) {
        setPsMat(item.Material_Name);
        setPsChar(item.Characteristics || "");
        setPsUnit(item.Unit);
        setPsVol(item.Proj_Vol.toString());
      }
    } else if (activeTab === "contractors") {
      const item = contractors.find((i) => i.Cont_ID === selectedId);
      if (item) {
        setCContract(item.Contract_ID);
        setCName(item.Org_Name);
        setCContact(item.Contact_Person || "");
        setCSize(item.Team_Size.toString());
        setCDesc(item.Work_Desc);
        setCDays(item.Offer_Days.toString());
        setCCost(item.Offer_Cost.toString());
      }
    }
  };

  // Сохранение
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "ppr") {
      if (isEditMode && selectedId !== null) {
        setPprList(
          pprList.map((i) =>
            i.PPR_ID === selectedId
              ? {
                  PPR_ID: selectedId,
                  PPR_Section: pprSection,
                  Object_Name: "ЖК «Северный»",
                  Parameter: pprParam,
                  Value: pprVal,
                }
              : i,
          ),
        );
      } else {
        const newId =
          pprList.length > 0
            ? Math.max(...pprList.map((i) => i.PPR_ID)) + 1
            : 1;
        setPprList([
          ...pprList,
          {
            PPR_ID: newId,
            PPR_Section: pprSection,
            Object_Name: "ЖК «Северный»",
            Parameter: pprParam,
            Value: pprVal,
          },
        ]);
      }
    } else if (activeTab === "works") {
      if (isEditMode && selectedId !== null) {
        setWorkTypes(
          workTypes.map((i) =>
            i.WorkType_ID === selectedId
              ? {
                  WorkType_ID: selectedId,
                  Work_name: wtName,
                  Complexity: parseFloat(wtComp) || 1.0,
                  Specialists: wtSpec,
                  Staff_Qty: parseInt(wtStaff) || 1,
                  Duration: parseInt(wtDur) || 1,
                }
              : i,
          ),
        );
      } else {
        const newId =
          workTypes.length > 0
            ? Math.max(...workTypes.map((i) => i.WorkType_ID)) + 1
            : 1;
        setWorkTypes([
          ...workTypes,
          {
            WorkType_ID: newId,
            Work_name: wtName,
            Complexity: parseFloat(wtComp) || 1.0,
            Specialists: wtSpec,
            Staff_Qty: parseInt(wtStaff) || 1,
            Duration: parseInt(wtDur) || 1,
          },
        ]);
      }
    } else if (activeTab === "deadlines") {
      if (isEditMode && selectedId !== null) {
        setDeadlines(
          deadlines.map((i) =>
            i.Deadline_ID === selectedId
              ? {
                  Deadline_ID: selectedId,
                  Stage_name: cdStage,
                  Start_date: cdStart,
                  End_date: cdEnd,
                  Rigidity: cdRigid,
                  Comment: cdComment || null,
                }
              : i,
          ),
        );
      } else {
        const newId =
          deadlines.length > 0
            ? Math.max(...deadlines.map((i) => i.Deadline_ID)) + 1
            : 1;
        setDeadlines([
          ...deadlines,
          {
            Deadline_ID: newId,
            Stage_name: cdStage,
            Start_date: cdStart,
            End_date: cdEnd,
            Rigidity: cdRigid,
            Comment: cdComment || null,
          },
        ]);
      }
    } else if (activeTab === "volumes") {
      if (isEditMode && selectedId !== null) {
        setWorkVolumes(
          workVolumes.map((i) =>
            i.Vol_ID === selectedId
              ? {
                  Vol_ID: selectedId,
                  Work_name: wvName,
                  Volume: parseFloat(wvVol) || 0,
                  Unit: wvUnit,
                  Dependency: wvDep,
                  Duration_Days: parseInt(wvDays) || 1,
                }
              : i,
          ),
        );
      } else {
        const newId =
          workVolumes.length > 0
            ? Math.max(...workVolumes.map((i) => i.Vol_ID)) + 1
            : 1;
        setWorkVolumes([
          ...workVolumes,
          {
            Vol_ID: newId,
            Work_name: wvName,
            Volume: parseFloat(wvVol) || 0,
            Unit: wvUnit,
            Dependency: wvDep,
            Duration_Days: parseInt(wvDays) || 1,
          },
        ]);
      }
    } else if (activeTab === "spec") {
      if (isEditMode && selectedId !== null) {
        setProjectSpec(
          projectSpec.map((i) =>
            i.Spec_ID === selectedId
              ? {
                  Spec_ID: selectedId,
                  Object_Name: "ЖК «Северный»",
                  Material_Name: psMat,
                  Characteristics: psChar || null,
                  Unit: psUnit,
                  Proj_Vol: parseFloat(psVol) || 0,
                }
              : i,
          ),
        );
      } else {
        const newId =
          projectSpec.length > 0
            ? Math.max(...projectSpec.map((i) => i.Spec_ID)) + 1
            : 1;
        setProjectSpec([
          ...projectSpec,
          {
            Spec_ID: newId,
            Object_Name: "ЖК «Северный»",
            Material_Name: psMat,
            Characteristics: psChar || null,
            Unit: psUnit,
            Proj_Vol: parseFloat(psVol) || 0,
          },
        ]);
      }
    } else if (activeTab === "contractors") {
      if (isEditMode && selectedId !== null) {
        setContractors(
          contractors.map((i) =>
            i.Cont_ID === selectedId
              ? {
                  Cont_ID: selectedId,
                  Contract_ID: cContract,
                  Org_Name: cName,
                  Contact_Person: cContact || null,
                  Team_Size: parseInt(cSize) || 1,
                  Work_Desc: cDesc,
                  Offer_Days: parseInt(cDays) || 1,
                  Offer_Cost: parseFloat(cCost) || 0,
                }
              : i,
          ),
        );
      } else {
        const newId =
          contractors.length > 0
            ? Math.max(...contractors.map((i) => i.Cont_ID)) + 1
            : 1;
        setContractors([
          ...contractors,
          {
            Cont_ID: newId,
            Contract_ID: cContract,
            Org_Name: cName,
            Contact_Person: cContact || null,
            Team_Size: parseInt(cSize) || 1,
            Work_Desc: cDesc,
            Offer_Days: parseInt(cDays) || 1,
            Offer_Cost: parseFloat(cCost) || 0,
          },
        ]);
      }
    }

    setIsModalOpen(false);
    setSelectedId(null);
  };

  return (
    <div className={styles.container}>
      {/* 6 Вкладок переключения */}
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
              color: "#64748b",
              marginLeft: "auto",
            }}
          >
            Выбрана строка с ID: {selectedId}
          </span>
        )}
      </div>

      {/* РЕНДЕРИНГ ТАБЛИЦ ЧЕРЕЗ УНИВЕРСАЛЬНЫЙ КОМПОНЕНТ */}

      {activeTab === "ppr" && (
        <DataTable
          title="Ведомость параметров ППР"
          headers={["ID", "Раздел ППР", "Объект", "Параметр", "Значение"]}
          data={pprList}
          columns={[
            "PPR_ID",
            "PPR_Section",
            "Object_Name",
            "Parameter",
            "Value",
          ]}
          idField="PPR_ID"
          selectedId={selectedId}
          onRowClick={handleRowClick}
        />
      )}

      {activeTab === "works" && (
        <DataTable
          title="Договорная ведомость видов работ"
          headers={[
            "ID",
            "Вид работ",
            "Сложность",
            "Требуемые специалисты",
            "Кол-во человек",
            "Срок",
          ]}
          data={workTypes}
          columns={[
            "WorkType_ID",
            "Work_name",
            (item) => item.Complexity.toFixed(1), // кастомный рендерер сложности
            "Specialists",
            (item) => `${item.Staff_Qty} чел.`,
            (item) => `${item.Duration} дней`,
          ]}
          idField="WorkType_ID"
          selectedId={selectedId}
          onRowClick={handleRowClick}
        />
      )}

      {activeTab === "deadlines" && (
        <DataTable
          title="Требования заказчика по срокам"
          headers={[
            "ID",
            "Этап проекта",
            "Дата начала",
            "Дата окончания",
            "Жесткость",
            "Комментарий",
          ]}
          data={deadlines}
          columns={[
            "Deadline_ID",
            "Stage_name",
            "Start_date",
            "End_date",
            "Rigidity",
            (item) => item.Comment || "—",
          ]}
          idField="Deadline_ID"
          selectedId={selectedId}
          onRowClick={handleRowClick}
        />
      )}

      {activeTab === "volumes" && (
        <DataTable
          title="Ведомость объемов работ (ВОР)"
          headers={[
            "ID",
            "Наименование вида работ",
            "Объем",
            "Ед. изм.",
            "Зависимость",
            "Срок",
          ]}
          data={workVolumes}
          columns={[
            "Vol_ID",
            "Work_name",
            "Volume",
            "Unit",
            "Dependency",
            (item) => `${item.Duration_Days} дней`,
          ]}
          idField="Vol_ID"
          selectedId={selectedId}
          onRowClick={handleRowClick}
        />
      )}

      {activeTab === "spec" && (
        <DataTable
          title="Проектная спецификация материалов"
          headers={[
            "ID",
            "Наименование объекта",
            "Наименование ресурса",
            "Характеристика",
            "Ед. изм.",
            "Объем по проекту",
          ]}
          data={projectSpec}
          columns={[
            "Spec_ID",
            "Object_Name",
            "Material_Name",
            (item) => item.Characteristics || "—",
            "Unit",
            "Proj_Vol",
          ]}
          idField="Spec_ID"
          selectedId={selectedId}
          onRowClick={handleRowClick}
        />
      )}

      {activeTab === "contractors" && (
        <DataTable
          title="Список предложений подрядных организаций"
          headers={[
            "ID",
            "№ Договора",
            "Название Подрядчика",
            "Контактное Лицо",
            "Численность бригады",
            "Описание работ",
            "Срок выполнения",
            "Стоимость Работ",
          ]}
          data={contractors}
          columns={[
            "Cont_ID",
            "Contract_ID",
            "Org_Name",
            (item) => item.Contact_Person || "—",
            (item) => `${item.Team_Size} чел.`,
            "Work_Desc",
            "Offer_Days",
            (item) => (
              <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                {item.Offer_Cost.toLocaleString()} руб.
              </span>
            ),
          ]}
          idField="Cont_ID"
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
                {isEditMode
                  ? "Редактирование записи"
                  : "Добавление новой записи"}
              </h4>
            </div>
            <form onSubmit={handleSave}>
              <div className={styles.modalBody}>
                {/* Поля для ППР */}
                {activeTab === "ppr" && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Раздел ППР</label>
                      <input
                        type="text"
                        required
                        value={pprSection}
                        onChange={(e) => setPprSection(e.target.value)}
                        placeholder="Например, Сроки"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Параметр</label>
                      <input
                        type="text"
                        required
                        value={pprParam}
                        onChange={(e) => setPprParam(e.target.value)}
                        placeholder="Например, Дата начала СМР"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Значение</label>
                      <input
                        type="text"
                        required
                        value={pprVal}
                        onChange={(e) => setPprVal(e.target.value)}
                        placeholder="2026-03-20"
                      />
                    </div>
                  </>
                )}

                {/* Поля для Видов работ */}
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
                        step="0.1"
                        required
                        value={wtComp}
                        onChange={(e) => setWtComp(e.target.value)}
                        placeholder="1.5"
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
                        required
                        value={wtDur}
                        onChange={(e) => setWtDur(e.target.value)}
                        placeholder="15"
                      />
                    </div>
                  </>
                )}

                {/* Поля для Директивных сроков */}
                {activeTab === "deadlines" && (
                  <>
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
                        value={cdRigid}
                        onChange={(e) => setCdRigid(e.target.value)}
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

                {/* Поля для Ведомости объемов (ВОР) */}
                {activeTab === "volumes" && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Наименование вида работ</label>
                      <input
                        type="text"
                        required
                        value={wvName}
                        onChange={(e) => setWvName(e.target.value)}
                        placeholder="Общестроительные"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Объем</label>
                      <input
                        type="number"
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
                        required
                        value={wvDays}
                        onChange={(e) => setWvDays(e.target.value)}
                        placeholder="15"
                      />
                    </div>
                  </>
                )}

                {/* Поля для Спецификации материалов */}
                {activeTab === "spec" && (
                  <>
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
                        required
                        value={psVol}
                        onChange={(e) => setPsVol(e.target.value)}
                        placeholder="600"
                      />
                    </div>
                  </>
                )}

                {/* Поля для Подрядчиков */}
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
                        required
                        value={cCost}
                        onChange={(e) => setCCost(e.target.value)}
                        placeholder="500000"
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
