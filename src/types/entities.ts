export type UserRole = "Инженер ПТО" | "Руководитель проекта" | "Администратор";

export interface User {
  username: string;
  role: UserRole;
}

export interface PPRData {
  ppr_id: number;
  object_name: string;
  responsible_person: string;
  start_date_smr: string;
  technology_type: string;
  ppr_section?: string;
  parameter?: string;
  value?: string;
}

export interface WorkType {
  work_type_id: number;
  work_name: string;
  complexity: number;
  specialists: string;
  staff_qty: number;
  duration: number;
}

export interface ClientDeadline {
  deadline_id: number;
  ppr_id: number;
  object_name?: string;
  stage_name: string;
  start_date: string;
  end_date: string;
  rigidity: string;
  comment: string | null;
}

export interface WorkVolume {
  vol_id: number;
  ppr_id: number;
  object_name?: string;
  work_type_id: number;
  work_name?: string;
  volume: number;
  unit: string;
  dependency: string;
  duration_days: number;
}

export interface ProjectSpec {
  spec_id: number;
  ppr_id: number;
  object_name?: string;
  material_name: string;
  characteristics: string | null;
  unit: string;
  proj_vol: number;
}

export interface ConsumptionNorm {
  norm_id: number;
  work_type_id: number;
  work_name?: string;
  res_category: string;
  coeff_k: number;
  rationale: string | null;
}

export interface LaborNorm {
  norm_id: number;
  work_type_id: number;
  work_name?: string;
  specialty: string;
  rank: number;
  manhour_norm: number;
}

export interface Contractor {
  cont_id: number;
  contract_id: string;
  org_name: string;
  contact_person: string | null;
  team_size: number;
  work_desc: string;
  offer_days: number;
  offer_cost: number;
}

export interface CalendarPlan {
  plan_id: number;
  ppr_id: number;
  object_name?: string;
  work_type_id: number;
  work_name?: string;
  total_manhours: number;
  staff_qty: number;
  work_days: number;
  start_date: string;
  end_date: string;
}

export interface MTRPlan {
  mtr_id: number;
  ppr_id: number;
  object_name?: string;
  spec_id: number;
  mat_name?: string;
  unit: string;
  req_volume: number;
  delivery_date: string;
  stage_link: string;
}

export interface LaborPlan {
  labor_id: number;
  ppr_id: number;
  object_name?: string;
  work_type_id: number;
  work_name?: string;
  specialty: string;
  work_days: number;
  total_hours: number;
  staff_count: number;
}

export interface StaffAllocation {
  alloc_id: number;
  work_type_id: number;
  work_name?: string;
  work_vol_unit: string;
  cont_id: number | null;
  assigned_org?: string;
  final_days: number;
  actual_start: string;
  actual_end: string;
  final_cost: number;
}
