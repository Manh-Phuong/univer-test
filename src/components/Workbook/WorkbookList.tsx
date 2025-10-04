import React, { useEffect, useState } from "react";
import { useWorkbook } from "../../hooks/useWorkbook";
import { TemplateGallery } from "../Template/TemplateGallery";
import { ConnectionManager } from "../Connection/ConnectionManager";
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
  const [view, setView] = useState<"workbooks" | "templates" | "connections">(
    "workbooks"
  );

  useEffect(() => {
    if (view === "workbooks") {
      fetchWorkbooks();
    }
  }, [view, fetchWorkbooks]);

  const handleSearch = () => {
    fetchWorkbooks({ search, page: 1 });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete workbook "${name}"?`)) return;

    const result = await deleteWorkbook(id);
    if (result.success) {
      alert("Workbook deleted successfully");
      fetchWorkbooks();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header with Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          borderBottom: "2px solid #e0e0e0",
          paddingBottom: "16px",
        }}
      >
        <div style={{ display: "flex", gap: "24px" }}>
          <button
            onClick={() => setView("workbooks")}
            style={{
              padding: "8px 0",
              background: "none",
              border: "none",
              borderBottom:
                view === "workbooks"
                  ? "3px solid #007bff"
                  : "3px solid transparent",
              color: view === "workbooks" ? "#007bff" : "#666",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Workbooks
          </button>
          <button
            onClick={() => setView("templates")}
            style={{
              padding: "8px 0",
              background: "none",
              border: "none",
              borderBottom:
                view === "templates"
                  ? "3px solid #007bff"
                  : "3px solid transparent",
              color: view === "templates" ? "#007bff" : "#666",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Templates
          </button>
          <button
            onClick={() => setView("connections")}
            style={{
              padding: "8px 0",
              background: "none",
              border: "none",
              borderBottom:
                view === "connections"
                  ? "3px solid #007bff"
                  : "3px solid transparent",
              color: view === "connections" ? "#007bff" : "#666",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Connections
          </button>
        </div>

        {view === "workbooks" && (
          <button
            onClick={onCreateNew}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            + New Workbook
          </button>
        )}
      </div>

      {/* Workbooks View */}
      {view === "workbooks" && (
        <>
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

          {loading && workbooks.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              Loading...
            </div>
          ) : error ? (
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
          ) : workbooks.length === 0 ? (
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
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(0,0,0,0.1)";
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
                      Updated:{" "}
                      {new Date(workbook.updated_at).toLocaleDateString()}
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
        </>
      )}

      {/* Templates View */}
      {view === "templates" && (
        <TemplateGallery
          onWorkbookCreated={(workbookId) => {
            // Navigate to the created workbook
            fetchWorkbooks().then(() => {
              const createdWorkbook = workbooks.find(
                (wb) => wb.id === workbookId
              );
              if (createdWorkbook) {
                onSelect(createdWorkbook);
              }
            });
          }}
        />
      )}

      {/* Connections View */}
      {view === "connections" && <ConnectionManager />}
    </div>
  );
};
