import React, { useEffect, useState } from "react";
import { useConnection } from "../../hooks/useConnection";
import { DataConnection, ColumnMapping } from "../../types/template.types";
import { dataApi } from "../../api/data.api";

interface Props {
  currentSnapshot: any;
  onClose: () => void;
  onDataLoaded: (newSnapshot: any) => void;
}

export const LoadDataModal: React.FC<Props> = ({
  currentSnapshot,
  onClose,
  onDataLoaded,
}) => {
  const { listConnections } = useConnection();
  const [connections, setConnections] = useState<DataConnection[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState("");
  const [queryText, setQueryText] = useState("");
  const [dataStartRow, setDataStartRow] = useState(1);
  const [sheetId, setSheetId] = useState("sheet-1");
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Column mapping inputs
  const [queryColumn, setQueryColumn] = useState("");
  const [sheetColumn, setSheetColumn] = useState("0");
  const [format, setFormat] = useState<
    "currency" | "number" | "percentage" | "date" | ""
  >("");

  const [startColumn, setStartColumn] = useState<string>("A"); // Change to string
  const [styleTemplateRow, setStyleTemplateRow] = useState<
    number | undefined
  >();
  const [useStyleTemplate, setUseStyleTemplate] = useState(false);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    const result = await listConnections();
    if (result.success && result.data) {
      setConnections(result.data);
    }
  };

  const addColumnMapping = () => {
    if (queryColumn && sheetColumn) {
      setColumnMappings([
        ...columnMappings,
        {
          queryColumn,
          sheetColumn: parseInt(sheetColumn),
          format: format || undefined,
        },
      ]);
      setQueryColumn("");
      setSheetColumn("0");
      setFormat("");
    }
  };

  const removeColumnMapping = (index: number) => {
    setColumnMappings(columnMappings.filter((_, i) => i !== index));
  };

  const handleLoadData = async () => {
    if (!selectedConnectionId || !queryText) {
      alert("Please fill in connection and query");
      return;
    }

    setIsLoading(true);

    try {
      const response = await dataApi.mergeData({
        snapshot: currentSnapshot,
        connectionId: selectedConnectionId,
        queryText,
        dataStartRow,
        sheetId,
        columnMappings: columnMappings.length > 0 ? columnMappings : undefined,
        startColumn, // NEW
        styleTemplateRow: useStyleTemplate ? styleTemplateRow : undefined, // NEW
      });

      console.log("API Response rowCount:", response.rowCount);
      console.log("Snapshot keys:", Object.keys(response.snapshot.sheets));
      console.log(
        "CellData rows:",
        Object.keys(response.snapshot.sheets["sheet-1"]?.cellData || {}).length
      );

      const cellData = response.snapshot.sheets["sheet-1"]?.cellData;
      const rowNumbers = Object.keys(cellData)
        .map(Number)
        .sort((a, b) => a - b);
      console.log("First row:", rowNumbers[0]);
      console.log("Last row:", rowNumbers[rowNumbers.length - 1]);
      console.log("Total rows in cellData:", rowNumbers.length);

      onDataLoaded(response.snapshot);
    } catch (error: any) {
      alert(`Failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "24px",
          width: "90%",
          maxWidth: "700px",
          maxHeight: "90vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 24px 0" }}>Load Data from Connection</h2>

        {/* Connection Selection */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            Connection:
          </label>
          <select
            value={selectedConnectionId}
            onChange={(e) => setSelectedConnectionId(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <option value="">Select connection...</option>
            {connections.map((conn) => (
              <option key={conn.id} value={conn.id}>
                {conn.name} ({conn.type} - {conn.host}:{conn.port})
              </option>
            ))}
          </select>
        </div>

        {/* Query Text */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            Query:
          </label>
          <textarea
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="SELECT column1, column2 FROM table"
            rows={4}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              fontFamily: "monospace",
              resize: "vertical", // ✅ Chỉ cho phép resize theo chiều dọc
              maxWidth: "100%", // ✅ Không vượt quá width của parent
              boxSizing: "border-box", // ✅ Padding tính trong width
            }}
          />
        </div>

        {/* Data Start Row */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            Insert data starting from row:
          </label>
          <input
            type="number"
            value={dataStartRow}
            onChange={(e) => setDataStartRow(parseInt(e.target.value))}
            min={0}
            style={{
              width: "100px",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            Start from column (for auto-mapping):
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="text"
              value={startColumn}
              onChange={(e) => setStartColumn(e.target.value.toUpperCase())}
              placeholder="A, B, AD, ZZ..."
              style={{
                width: "80px",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                textTransform: "uppercase",
              }}
            />
            <span style={{ fontSize: "14px", color: "#666" }}>
              (e.g., A, D, AD, ZZ)
            </span>
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={useStyleTemplate}
              onChange={(e) => setUseStyleTemplate(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            <span>Copy styles from a template row</span>
          </label>
        </div>

        {useStyleTemplate && (
          <div style={{ marginBottom: "16px", marginLeft: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              Template row number:
            </label>
            <input
              type="number"
              value={styleTemplateRow || 0}
              onChange={(e) => setStyleTemplateRow(parseInt(e.target.value))}
              placeholder="e.g., 6"
              min={0}
              style={{
                width: "100px",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
            <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
              Styles from this row will be applied to all data rows
            </p>
          </div>
        )}

        {/* Column Mapping */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            Column Mapping (optional - auto-map A-Z if empty):
          </label>
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input
              type="text"
              placeholder="Query column"
              value={queryColumn}
              onChange={(e) => setQueryColumn(e.target.value)}
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
            <input
              type="number"
              placeholder="Sheet column (0=A, 1=B)"
              value={sheetColumn}
              onChange={(e) => setSheetColumn(e.target.value)}
              style={{
                width: "150px",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              style={{
                width: "120px",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              <option value="">No format</option>
              <option value="currency">Currency</option>
              <option value="number">Number</option>
              <option value="percentage">Percentage</option>
              <option value="date">Date</option>
            </select>
            <button
              onClick={addColumnMapping}
              style={{
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>
          {columnMappings.map((mapping, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px",
                backgroundColor: "#f8f9fa",
                borderRadius: "4px",
                marginBottom: "4px",
              }}
            >
              <span>
                {mapping.queryColumn} → Column{" "}
                {String.fromCharCode(65 + mapping.sheetColumn)}
                {mapping.format && ` (${mapping.format})`}
              </span>
              <button
                onClick={() => removeColumnMapping(index)}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "24px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleLoadData}
            disabled={isLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: isLoading ? "#ccc" : "#ff9800",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Loading..." : "Load Data"}
          </button>
        </div>
      </div>
    </div>
  );
};
