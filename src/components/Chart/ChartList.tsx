import { ChartConfig } from "../../types/chart.types";
import { ChartPreview } from "./ChartPreview";
import {
  extractDataFromSnapshot,
  buildEChartsOption,
} from "../../utils/chartHelpers";

interface ChartListProps {
  charts: ChartConfig[];
  snapshot: any;
  onEdit: (chart: ChartConfig) => void;
  onDelete: (chartId: string) => void;
  onClose: () => void;
}

export const ChartList: React.FC<ChartListProps> = ({
  charts,
  snapshot,
  onEdit,
  onDelete,
  onClose,
}) => {
  const renderChart = (chart: ChartConfig) => {
    if (!snapshot) return null;

    try {
      const xAxisData = extractDataFromSnapshot(
        snapshot,
        chart.dataRange.xAxis
      );
      const seriesData = chart.dataRange.series.map((range) =>
        extractDataFromSnapshot(snapshot, range)
      );
      const seriesNames = chart.dataRange.series.map(
        (_, i) => `Series ${i + 1}`
      );

      return buildEChartsOption(chart.type, xAxisData, seriesData, seriesNames);
    } catch (error) {
      console.error("Chart render error:", error);
      return null;
    }
  };

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
          maxWidth: "1200px",
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
          <h2 style={{ margin: 0 }}>Charts ({charts.length})</h2>
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

        {charts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#999",
            }}
          >
            No charts yet. Click "+ Chart" to create one.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
              gap: "20px",
            }}
          >
            {charts.map((chart) => {
              const option = renderChart(chart);

              return (
                <div
                  key={chart.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "16px",
                    background: "#f9f9f9",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: "16px" }}>
                      {chart.name}
                    </h3>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => onEdit(chart)}
                        style={{
                          padding: "4px 12px",
                          background: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${chart.name}"?`)) {
                            onDelete(chart.id);
                          }
                        }}
                        style={{
                          padding: "4px 12px",
                          background: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "12px",
                    }}
                  >
                    Type: {chart.type} | Range: {chart.dataRange.xAxis}
                  </div>

                  {option ? (
                    <ChartPreview option={option} style={{ height: "300px" }} />
                  ) : (
                    <div
                      style={{
                        height: "300px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "white",
                        borderRadius: "4px",
                        color: "#999",
                      }}
                    >
                      Unable to render chart
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
