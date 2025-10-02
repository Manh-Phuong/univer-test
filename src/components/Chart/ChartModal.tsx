import { useState, useEffect } from "react";
import { ChartConfig } from "../../types/chart.types";
import {
  extractDataFromSnapshot,
  buildEChartsOption,
} from "../../utils/chartHelpers";
import { ChartPreview } from "./ChartPreview";

interface ChartModalProps {
  isOpen: boolean;
  snapshot: any;
  existingChart?: ChartConfig;
  onSave: (chart: ChartConfig) => void;
  onClose: () => void;
}

export const ChartModal: React.FC<ChartModalProps> = ({
  isOpen,
  snapshot,
  existingChart,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(existingChart?.name || "");
  const [type, setType] = useState(existingChart?.type || "line");
  const [xAxisRange, setXAxisRange] = useState(
    existingChart?.dataRange.xAxis || "A1:A10"
  );
  const [seriesRanges, setSeriesRanges] = useState<string[]>(
    existingChart?.dataRange.series || ["B1:B10"]
  );
  const [previewOption, setPreviewOption] = useState<any>(null);

  useEffect(() => {
    if (!snapshot) return;

    try {
      const xAxisData = extractDataFromSnapshot(snapshot, xAxisRange);
      const seriesData = seriesRanges.map((range) =>
        extractDataFromSnapshot(snapshot, range)
      );
      const seriesNames = seriesRanges.map((_, i) => `Series ${i + 1}`);

      const option = buildEChartsOption(
        type,
        xAxisData,
        seriesData,
        seriesNames
      );
      setPreviewOption(option);
    } catch (error) {
      console.error("Preview error:", error);
    }
  }, [snapshot, type, xAxisRange, seriesRanges]);

  const handleSave = () => {
    const chart: ChartConfig = {
      id: existingChart?.id || `chart-${Date.now()}`,
      name: name || "Untitled Chart",
      type,
      dataRange: { xAxis: xAxisRange, series: seriesRanges },
      createdAt: existingChart?.createdAt || new Date(),
    };
    onSave(chart);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflow: "auto",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>Create Chart</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}
          >
            Chart Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Chart"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}
          >
            Chart Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            <optgroup label="Basic">
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="area">Area</option>
              <option value="pie">Pie</option>
              <option value="scatter">Scatter</option>
            </optgroup>
            <optgroup label="Advanced">
              <option value="heatmap">Heatmap</option>
              <option value="radar">Radar</option>
              <option value="treemap">Treemap</option>
              <option value="sunburst">Sunburst</option>
              <option value="boxplot">Boxplot</option>
              <option value="candlestick">Candlestick</option>
              <option value="gauge">Gauge</option>
              <option value="funnel">Funnel</option>
              <option value="sankey">Sankey</option>
              <option value="graph">Graph/Network</option>
            </optgroup>
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}
          >
            X-Axis Range (e.g., A1:A10)
          </label>
          <input
            type="text"
            value={xAxisRange}
            onChange={(e) => setXAxisRange(e.target.value)}
            placeholder="A1:A10"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}
          >
            Data Series
          </label>
          {seriesRanges.map((range, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
            >
              <input
                type="text"
                value={range}
                onChange={(e) => {
                  const newRanges = [...seriesRanges];
                  newRanges[i] = e.target.value;
                  setSeriesRanges(newRanges);
                }}
                placeholder="B1:B10"
                style={{
                  flex: 1,
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
              {seriesRanges.length > 1 && (
                <button
                  onClick={() =>
                    setSeriesRanges(seriesRanges.filter((_, idx) => idx !== i))
                  }
                  style={{
                    padding: "8px 12px",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => setSeriesRanges([...seriesRanges, "C1:C10"])}
            style={{
              padding: "8px 16px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            + Add Series
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}
          >
            Preview
          </label>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "16px",
            }}
          >
            {previewOption ? (
              <ChartPreview option={previewOption} />
            ) : (
              <div
                style={{
                  height: "400px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#999",
                }}
              >
                No preview available
              </div>
            )}
          </div>
        </div>

        <div
          style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {existingChart ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};
