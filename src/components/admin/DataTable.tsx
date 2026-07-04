"use client";

import { useState, useMemo } from "react";

type SortDirection = "asc" | "desc";

type Column<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T extends Record<string, unknown>> = {
  columns: Column<T>[];
  data: T[];
  searchKeys?: (keyof T)[];
  actions?: (row: T) => React.ReactNode;
};

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchKeys = [],
  actions,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [search, setSearch] = useState("");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [data, sortKey, sortDir]);

  const filteredData = useMemo(() => {
    if (!search.trim()) return sortedData;

    const lower = search.toLowerCase();
    return sortedData.filter((row) => {
      if (searchKeys.length === 0) {
        return Object.values(row).some((val) => {
          if (typeof val === "string") return val.toLowerCase().includes(lower);
          if (typeof val === "number") return String(val).includes(lower);
          if (typeof val === "boolean") return String(val).includes(lower);
          return false;
        });
      }

      return searchKeys.some((key) => {
        const val = row[key];
        if (typeof val === "string") return val.toLowerCase().includes(lower);
        if (typeof val === "number") return String(val).includes(lower);
        if (typeof val === "boolean") return String(val).includes(lower);
        return false;
      });
    });
  }, [sortedData, search, searchKeys]);

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-gold/20 bg-navy px-3 py-2 text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gold/20">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-navy-light">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-medium text-gold ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span className="text-xs">{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-4 py-3 font-medium text-gold text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-8 text-center text-cream/50"
                >
                  No results found.
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr key={idx} className="bg-navy-light hover:bg-gold/5 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-cream">
                      {col.render
                        ? col.render(row)
                        : String(row[col.key] ?? "")}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
