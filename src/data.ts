import type { IWorkbookData } from "@univerjs/core";

export const WORKBOOK_DATA: Partial<IWorkbookData> = {
  id: "workbook-1",
  sheetOrder: ["sheet-1"],
  sheets: {
    "sheet-1": {
      id: "sheet-1",
      name: "Sheet1",
      cellData: {
        0: {
          0: { v: "Hello Univer!" },
          1: { v: "Test data" }
        },
        1: {
          0: { v: 123 },
          1: { v: 456 }
        }
      },
    },
  },
};
