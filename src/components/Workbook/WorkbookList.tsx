import React, { useEffect, useState } from "react";
import { useWorkbook } from "../../hooks/useWorkbook";
import type { Workbook } from "../../types";

interface WorkbookListProps {
  onSelect: (workbook: Workbook) => void;
  onCreateNew: () => void;
}

export const WorkbookList: React.FC<WorkbookListProps> = ({
  onSelect,
  onCreateNew,
}) => {
  const { workbooks, loading, error, fetchWorkbooks, deleteWorkbook } =
    useWorkbook();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchWorkbooks();
  }, [fetchWorkbooks]);

  const handleSearch = () => {
    fetchWorkbooks({ search, page: 1 });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete workbook "${name}"?`)) return;

    const result = await deleteWorkbook(id);
    if (result.success) {
      alert("Workbook deleted successfully");
    }
  };

  if (loading && workbooks.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <h2 style={{ flex: 1, margin: 0 }}>My Workbooks</h2>
        <button
          onClick={onCreateNew}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          + New Workbook
        </button>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search workbooks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            backgroundColor: "#fee",
            color: "#c00",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      {workbooks.length === 0 ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#666",
          }}
        >
          No workbooks found. Create your first workbook!
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "15px",
          }}
        >
          {workbooks.map((workbook) => (
            <div
              key={workbook.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                cursor: "pointer",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
              onClick={() => onSelect(workbook)}
            >
              <h3
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "16px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {workbook.name}
              </h3>

              {workbook.description && (
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "14px",
                    color: "#666",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {workbook.description}
                </p>
              )}

              <div
                style={{
                  fontSize: "12px",
                  color: "#999",
                  marginBottom: "10px",
                }}
              >
                <div>{workbook.sheet_count} sheet(s)</div>
                <div>
                  Updated: {new Date(workbook.updated_at).toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(workbook.id, workbook.name);
                }}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
