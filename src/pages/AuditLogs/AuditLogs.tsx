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
            "Сотрудник",
            "Дата и время",
            "Операция",
            "Таблица БД",
            "Описание действия",
          ]}
          data={logs || []}
          columns={[
            (item: any) => (logs || []).indexOf(item) + 1,
            "username",
            (item: any) => new Date(item.action_time).toLocaleString(),
            "action_type",
            "table_name",
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
