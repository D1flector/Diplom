// 1. Роли пользователей
export type UserRole = "Инженер ПТО" | "Руководитель проекта" | "Администратор";

export interface User {
  username: string;
  role: UserRole;
}

// 2. Исходные параметры проекта (ППР)
export interface PPRData {
  PPR_ID: number;
  PPR_Section: string;
  Object_Name: string;
  Parameter: string;
  Value: string;
}

// 3. Ведомость видов работ
export interface WorkType {
  WorkType_ID: number;
  Work_name: string;
  Complexity: number;
  Specialists: string;
  Staff_Qty: number;
  Duration: number;
}

// 4. Директивные сроки
export interface ClientDeadline {
  Deadline_ID: number;
  Stage_name: string;
  Start_date: string;
  End_date: string;
  Rigidity: string;
  Comment: string | null;
}

// 5. Ведомость объемов работ (ВОР)
export interface WorkVolume {
  Vol_ID: number;
  Work_name: string;
  Volume: number;
  Unit: string;
  Dependency: string;
  Duration_Days: number;
}

// 6. Проектная спецификация материалов
export interface ProjectSpec {
  Spec_ID: number;
  Object_Name: string;
  Material_Name: string;
  Characteristics: string | null;
  Unit: string;
  Proj_Vol: number;
}

// 7. Справочник норм расхода материалов
export interface ConsumptionNorm {
  Norm_ID: number;
  Res_Category: string;
  Work_Type: string;
  Coeff_K: number;
  Rationale: string | null;
}

// 8. Справочник трудовых норм
export interface LaborNorm {
  Norm_ID: number;
  Work_Type: string;
  Specialty: string;
  Rank: number;
  ManHour_Norm: number;
}

// 9. Список предложений бригад подрядчиков
export interface Contractor {
  Cont_ID: number;
  Contract_ID: string;
  Org_Name: string;
  Contact_Person: string | null;
  Team_Size: number;
  Work_Desc: string;
  Offer_Days: number;
  Offer_Cost: number;
}

// 10. Результат Задачи 1: Календарный план
export interface CalendarPlan {
  Plan_ID: number;
  Object_Name: string;
  Work_Name: string;
  Total_ManHours: number;
  Staff_Qty: number;
  Work_Days: number;
  Start_Date: string;
  End_Date: string;
}

// 11. Результат Задачи 2: Ведомость потребности в МТР
export interface MTRPlan {
  MTR_ID: number;
  Object_Name: string;
  Mat_Name: string;
  Unit: string;
  Req_Volume: number;
  Delivery_Date: string;
  Stage_Link: string;
}

// 12. Результат Задачи 3: Ведомость потребности в трудовых ресурсах
export interface LaborPlan {
  Labor_ID: number;
  Object_Name: string;
  Work_Name: string;
  Specialty: string;
  Work_Days: number;
  Total_Hours: number;
  Staff_Count: number;
}

// 13. Результат Задачи 4: План расстановки специалистов
export interface StaffAllocation {
  Alloc_ID: number;
  Work_Name: string;
  Work_Vol_Unit: string;
  Assigned_Org: string;
  Final_Days: number;
  Actual_Start: string;
  Actual_End: string;
  Final_Cost: number;
}
