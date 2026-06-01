import type {
  PPRData,
  WorkType,
  ClientDeadline,
  WorkVolume,
  ProjectSpec,
  ConsumptionNorm,
  LaborNorm,
  Contractor,
} from "./entities";

// 1. Тестовые параметры проекта (PPR_data)
export const initialPPRData: PPRData[] = [
  {
    PPR_ID: 1,
    PPR_Section: "Сроки",
    Object_Name: "ЖК «Северный»",
    Parameter: "Дата начала СМР",
    Value: "2026-03-20",
  },
  {
    PPR_ID: 2,
    PPR_Section: "Сроки",
    Object_Name: "ЖК «Северный»",
    Parameter: "Дата окончания СМР",
    Value: "2026-04-15",
  },
  {
    PPR_ID: 3,
    PPR_Section: "Ограничения",
    Object_Name: "ЖК «Северный»",
    Parameter: "Технология",
    Value: "Последовательная",
  },
];

// 2. Тестовый справочник видов работ (Work_types)
export const initialWorkTypes: WorkType[] = [
  {
    WorkType_ID: 1,
    Work_name: "Подготовительные",
    Complexity: 1.0,
    Specialists: "Разнорабочие",
    Staff_Qty: 1,
    Duration: 5,
  },
  {
    WorkType_ID: 2,
    Work_name: "Общестроительные",
    Complexity: 1.5,
    Specialists: "Бетонщики",
    Staff_Qty: 5,
    Duration: 15,
  },
  {
    WorkType_ID: 3,
    Work_name: "Инженерные сети",
    Complexity: 1.2,
    Specialists: "Монтажники",
    Staff_Qty: 8,
    Duration: 10,
  },
];

// 3. Тестовые директивные сроки (Client_deadlines)
export const initialClientDeadlines: ClientDeadline[] = [
  {
    Deadline_ID: 1,
    Stage_name: "Подготовительные",
    Start_date: "2026-03-20",
    End_date: "2026-03-25",
    Rigidity: "Высокая",
    Comment: "Без задержек",
  },
  {
    Deadline_ID: 2,
    Stage_name: "Общестроительные",
    Start_date: "2026-03-26",
    End_date: "2026-04-15",
    Rigidity: "Высокая",
    Comment: "Основной этап",
  },
];

// 4. Тестовая ведомость объемов работ (Work_volumes / ВОР)
export const initialWorkVolumes: WorkVolume[] = [
  {
    Vol_ID: 1,
    Work_name: "Подготовительные",
    Volume: 100,
    Unit: "м2",
    Dependency: "Нет",
    Duration_Days: 5,
  },
  {
    Vol_ID: 2,
    Work_name: "Общестроительные",
    Volume: 500,
    Unit: "м3",
    Dependency: "После подготовительных",
    Duration_Days: 15,
  },
];

// 5. Тестовая проектная спецификация материалов (Project_spec)
export const initialProjectSpec: ProjectSpec[] = [
  {
    Spec_ID: 1,
    Object_Name: "ЖК «Северный»",
    Material_Name: "Бетон тяжелый",
    Characteristics: "B30 (М400)",
    Unit: "м3",
    Proj_Vol: 600,
  },
  {
    Spec_ID: 2,
    Object_Name: "ЖК «Северный»",
    Material_Name: "Арматурная сталь",
    Characteristics: "А500С д.16",
    Unit: "т",
    Proj_Vol: 45,
  },
  {
    Spec_ID: 3,
    Object_Name: "ЖК «Северный»",
    Material_Name: "Фиксаторы арматуры",
    Characteristics: "Стульчик 25 мм",
    Unit: "шт.",
    Proj_Vol: 5000,
  },
];

// 6. Тестовый справочник производственных норм расхода (Consumption_norms)
export const initialConsumptionNorms: ConsumptionNorm[] = [
  {
    Norm_ID: 1,
    Res_Category: "Бетон тяжелый",
    Work_Type: "Общестроительные",
    Coeff_K: 1.02,
    Rationale: "ГОСТ 7473",
  },
  {
    Norm_ID: 2,
    Res_Category: "Арматурная сталь",
    Work_Type: "Общестроительные",
    Coeff_K: 1.03,
    Rationale: "Тех. карта",
  },
  {
    Norm_ID: 3,
    Res_Category: "Фиксаторы арматуры",
    Work_Type: "Общестроительные",
    Coeff_K: 1.05,
    Rationale: "Регламент",
  },
];

// 7. Тестовый справочник трудовых норм (Labor_norms)
export const initialLaborNorms: LaborNorm[] = [
  {
    Norm_ID: 1,
    Work_Type: "Подготовительные",
    Specialty: "Разнорабочие",
    Rank: 2,
    ManHour_Norm: 0.4,
  },
  {
    Norm_ID: 2,
    Work_Type: "Общестроительные",
    Specialty: "Арматурщик",
    Rank: 4,
    ManHour_Norm: 20.0,
  },
  {
    Norm_ID: 3,
    Work_Type: "Общестроительные",
    Specialty: "Бетонщик",
    Rank: 3,
    ManHour_Norm: 1.3,
  },
];

// 8. Тестовый список предложений бригад подрядчиков (Contractor_List)
export const initialContractors: Contractor[] = [
  {
    Cont_ID: 1,
    Contract_ID: "5739",
    Org_Name: "ООО «Монолит-С»",
    Contact_Person: "Петров И.К.",
    Team_Size: 12,
    Work_Desc: "Общестроительные",
    Offer_Days: 10,
    Offer_Cost: 500000,
  },
  {
    Cont_ID: 2,
    Contract_ID: "5740",
    Org_Name: "ООО «СтальМонтаж»",
    Contact_Person: "Гришин Н.Е.",
    Team_Size: 10,
    Work_Desc: "Общестроительные",
    Offer_Days: 11,
    Offer_Cost: 450000,
  },
  {
    Cont_ID: 3,
    Contract_ID: "5741",
    Org_Name: "ООО «БетонПром»",
    Contact_Person: "Зуев А.Р.",
    Team_Size: 20,
    Work_Desc: "Общестроительные",
    Offer_Days: 5,
    Offer_Cost: 300000,
  },
];
