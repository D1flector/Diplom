import React from "react";
import styles from "./DataTable.module.scss";

// Описание типов входных параметров (Props) для универсальной таблицы
interface DataTableProps<T> {
  title: string;
  headers: string[];
  data: T[];
  columns: (keyof T | ((item: T) => React.ReactNode))[];
  idField: keyof T;
  selectedId: number | null;
  onRowClick: (id: number) => void;
}

export function DataTable<T>({
  title,
  headers,
  data,
  columns,
  idField,
  selectedId,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className={styles.tableBlock}>
      <div className={styles.tableHeader}>
        <h3>{title}</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th key={idx}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const itemId = item[idField] as unknown as number;
              const isSelected = selectedId === itemId;

              return (
                <tr
                  key={itemId}
                  onClick={() => onRowClick(itemId)}
                  className={`${styles.rowInteractive} ${isSelected ? styles.selectedRow : ""}`}
                >
                  {columns.map((col, colIdx) => {
                    return (
                      <td key={colIdx}>
                        {typeof col === "function"
                          ? col(item) // если передан кастомный рендерер (например, форматирование цены)
                          : (item[col] as React.ReactNode)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
