export interface ChartConfig {
  id: string;
  name: string;
  type: "line" | "bar" | "pie" | "area" | "scatter";
  dataRange: {
    xAxis: string; // "A1:A10"
    series: string[]; // ["B1:B10", "C1:C10"]
  };
  options?: any; // Custom ECharts options
  createdAt: Date;
}

export interface WorkbookWithCharts {
  snapshot: any; // Univer snapshot
  charts: ChartConfig[];
}

export const buildEChartsOption = (
  chartType: string,
  xAxisData: any[],
  seriesData: any[][],
  seriesNames: string[]
) => {
  // Pie chart
  if (chartType === "pie") {
    return {
      tooltip: { trigger: "item" },
      series: [
        {
          type: "pie",
          radius: "50%",
          data: xAxisData.map((name, i) => ({
            name,
            value: seriesData[0][i],
          })),
        },
      ],
    };
  }

  // Heatmap
  if (chartType === "heatmap") {
    return {
      tooltip: { position: "top" },
      grid: { height: "50%", top: "10%" },
      xAxis: { type: "category", data: xAxisData },
      yAxis: { type: "category", data: seriesNames },
      visualMap: { min: 0, max: 10, calculable: true },
      series: [
        {
          type: "heatmap",
          data: seriesData[0].map((val, i) => [i, 0, val]),
        },
      ],
    };
  }

  // Radar
  if (chartType === "radar") {
    return {
      radar: {
        indicator: xAxisData.map((name) => ({ name, max: 100 })),
      },
      series: [
        {
          type: "radar",
          data: [{ value: seriesData[0], name: seriesNames[0] }],
        },
      ],
    };
  }

  // Treemap
  if (chartType === "treemap") {
    return {
      series: [
        {
          type: "treemap",
          data: xAxisData.map((name, i) => ({
            name,
            value: seriesData[0][i],
          })),
        },
      ],
    };
  }

  // Gauge
  if (chartType === "gauge") {
    return {
      series: [
        {
          type: "gauge",
          data: [{ value: seriesData[0][0], name: seriesNames[0] }],
        },
      ],
    };
  }

  // Funnel
  if (chartType === "funnel") {
    return {
      series: [
        {
          type: "funnel",
          data: xAxisData.map((name, i) => ({
            name,
            value: seriesData[0][i],
          })),
        },
      ],
    };
  }

  // Default: Line/Bar/Area/Scatter
  return {
    tooltip: { trigger: "axis" },
    legend: { data: seriesNames },
    xAxis: { type: "category", data: xAxisData },
    yAxis: { type: "value" },
    series: seriesData.map((data, i) => ({
      name: seriesNames[i],
      type: chartType,
      data: data,
      smooth: chartType === "line",
    })),
  };
};
