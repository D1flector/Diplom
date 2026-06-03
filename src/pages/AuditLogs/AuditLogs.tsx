import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAuditLogs } from "../../store/slices/auditSlice";
import { DataTable } from "../../components/DataTable/DataTable";

export const AuditLogs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { logs, loading } = useAppSelector((state) => state.audit);

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  const translateAction = (action: string) => {
    const actionsMap: Record<string, string> = {
      INSERT: "Добавление",
      UPDATE: "Изменение",
      DELETE: "Удаление",
      CALCULATE: "Расчет планирования",
    };
    return actionsMap[action] || action;
  };

  const translateTable = (table: string) => {
    const tablesMap: Record<string, string> = {
      ppr_data: "Параметры ППР",
      work_types: "Виды работ",
      client_deadlines: "Директивные сроки",
      work_volumes: "Объемы работ (ВОР)",
      project_spec: "Спецификация материалов",
      contractors: "Подрядчики",
      contractor_list: "Подрядчики",
      consumption_norms: "Нормы расхода МТР",
      labor_norms: "Трудовые нормы",
      outputs: "Выходные документы",
    };
    return tablesMap[table] || table;
  };

  return (
    <div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
          Загрузка системного журнала безопасности...
        </div>
      ) : (
        <DataTable
          title="Журнал системного аудита безопасности действий пользователей"
          headers={[
            "№ п/п",
            "Сотрудник (ФИО)",
            "Дата и время",
            "Операция",
            "Раздел АСУ",
            "Описание действия",
          ]}
          data={logs || []}
          columns={[
            (item: any) => (logs || []).indexOf(item) + 1,
            "username",
            (item: any) => new Date(item.action_time).toLocaleString(),
            (item: any) => translateAction(item.action_type),
            (item: any) => translateTable(item.table_name),
            "details",
          ]}
          idField="log_id"
          selectedId={null}
          onRowClick={() => {}}
        />
      )}
    </div>
  );
};

export default AuditLogs;
