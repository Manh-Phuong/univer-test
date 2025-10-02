export const parseRange = (
  range: string
): { start: number[]; end: number[] } => {
  // "A1:A10" → { start: [0,0], end: [9,0] }
  const [startCell, endCell] = range.split(":");

  const parseCell = (cell: string) => {
    const col = cell.charCodeAt(0) - 65; // A=0, B=1...
    const row = parseInt(cell.slice(1)) - 1;
    return [row, col];
  };

  return {
    start: parseCell(startCell),
    end: parseCell(endCell),
  };
};

export const extractDataFromSnapshot = (
  snapshot: any,
  range: string
): any[] => {
  const { start, end } = parseRange(range);
  const sheetId = snapshot.sheetOrder[0];
  const cellData = snapshot.sheets[sheetId].cellData;

  const data = [];
  for (let r = start[0]; r <= end[0]; r++) {
    if (cellData[r] && cellData[r][start[1]]) {
      data.push(cellData[r][start[1]].v);
    }
  }
  return data;
};

export const buildEChartsOption = (
  chartType: string,
  xAxisData: any[],
  seriesData: any[][],
  seriesNames: string[]
) => {
  const baseOption = {
    tooltip: { trigger: "axis" },
    legend: { data: seriesNames },
    xAxis: { type: "category", data: xAxisData },
    yAxis: { type: "value" },
    series: seriesData.map((data, i) => ({
      name: seriesNames[i],
      type: chartType,
      data: data,
    })),
  };

  if (chartType === "pie") {
    return {
      tooltip: { trigger: "item" },
      series: [
        {
          type: "pie",
          data: xAxisData.map((name, i) => ({
            name,
            value: seriesData[0][i],
          })),
        },
      ],
    };
  }

  return baseOption;
};
