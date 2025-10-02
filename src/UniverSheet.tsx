// import React, { useEffect } from "react";
// import {
//   LocaleType,
//   mergeLocales,
//   Univer,
//   UniverInstanceType,
// } from "@univerjs/core";
// import DesignEnUS from "@univerjs/design/locale/en-US";
// import { UniverDocsPlugin } from "@univerjs/docs";
// import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
// import DocsUIEnUS from "@univerjs/docs-ui/locale/en-US";
// import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
// import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
// import { UniverSheetsPlugin } from "@univerjs/sheets";
// import { UniverSheetsFormulaUIPlugin } from "@univerjs/sheets-formula-ui";
// import SheetsFormulaUIEnUS from "@univerjs/sheets-formula-ui/locale/en-US";
// import { UniverSheetsNumfmtUIPlugin } from "@univerjs/sheets-numfmt-ui";
// import SheetsNumfmtUIEnUS from "@univerjs/sheets-numfmt-ui/locale/en-US";
// import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
// import SheetsUIEnUS from "@univerjs/sheets-ui/locale/en-US";
// import SheetsEnUS from "@univerjs/sheets/locale/en-US";
// import { UniverUIPlugin } from "@univerjs/ui";
// import UIEnUS from "@univerjs/ui/locale/en-US";
// import { IUniverInstanceService } from "@univerjs/core";

// import "@univerjs/design/lib/index.css";
// import "@univerjs/ui/lib/index.css";
// import "@univerjs/docs-ui/lib/index.css";
// import "@univerjs/sheets-ui/lib/index.css";
// import "@univerjs/sheets-formula-ui/lib/index.css";
// import "@univerjs/sheets-numfmt-ui/lib/index.css";

// import * as XLSX from "xlsx";

// let univer: Univer | null = null;

// const UniverSheet: React.FC = () => {
//   useEffect(() => {
//     if (!univer) {
//       univer = new Univer({
//         locale: LocaleType.EN_US,
//         locales: {
//           [LocaleType.EN_US]: mergeLocales(
//             DesignEnUS,
//             UIEnUS,
//             DocsUIEnUS,
//             SheetsEnUS,
//             SheetsUIEnUS,
//             SheetsFormulaUIEnUS,
//             SheetsNumfmtUIEnUS
//           ),
//         },
//       });

//       univer.registerPlugin(UniverRenderEnginePlugin);
//       univer.registerPlugin(UniverFormulaEnginePlugin);

//       univer.registerPlugin(UniverUIPlugin, {
//         container: "app",
//       });

//       univer.registerPlugin(UniverDocsPlugin);
//       univer.registerPlugin(UniverDocsUIPlugin);

//       univer.registerPlugin(UniverSheetsPlugin);
//       univer.registerPlugin(UniverSheetsUIPlugin);
//       univer.registerPlugin(UniverSheetsFormulaUIPlugin);
//       univer.registerPlugin(UniverSheetsNumfmtUIPlugin);

//       // Workbook trống ban đầu
//       univer.createUnit(UniverInstanceType.UNIVER_SHEET);
//     }
//   }, []);

//   // --- Import Excel ---
//   const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !univer) return;

//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       const data = new Uint8Array(evt.target?.result as ArrayBuffer);
//       const wb = XLSX.read(data, { type: "array" });

//       const sheetName = wb.SheetNames[0];
//       const sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
//         header: 1,
//       });

//       // Convert 2D array -> Univer format
//       const univerData = {
//         id: "workbook-import",
//         sheetOrder: ["sheet-1"],
//         sheets: {
//           "sheet-1": {
//             id: "sheet-1",
//             name: sheetName,
//             cellData: sheet.reduce((rows: any, row: any[], r: number) => {
//               rows[r] = {};
//               row.forEach((cell, c) => {
//                 if (cell !== undefined && cell !== null && cell !== "") {
//                   rows[r][c] = { v: cell };
//                 }
//               });
//               return rows;
//             }, {}),
//           },
//         },
//       };

//       univer.createUnit(UniverInstanceType.UNIVER_SHEET, univerData);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   // --- Export Excel ---
//   const handleExport = () => {
//     if (!univer) return;

//     // Lấy instance service
//     const univerInstanceService = univer
//       .__getInjector()
//       .get(IUniverInstanceService);
//     const workbook = univerInstanceService.getCurrentUnitForType(
//       UniverInstanceType.UNIVER_SHEET
//     );

//     if (!workbook) return;

//     const snapshot = workbook.save();
//     const firstSheetId = snapshot.sheetOrder?.[0];
//     const sheet = snapshot.sheets?.[firstSheetId];

//     // Convert cellData sang array 2D
//     const aoa: any[][] = [];
//     if (sheet?.cellData) {
//       Object.entries(sheet.cellData).forEach(([r, row]) => {
//         const rowIdx = Number(r);
//         aoa[rowIdx] = aoa[rowIdx] || [];
//         Object.entries(row as any).forEach(([c, cell]) => {
//           aoa[rowIdx][Number(c)] = (cell as any).v;
//         });
//       });
//     }

//     // Tạo file Excel
//     const ws = XLSX.utils.aoa_to_sheet(aoa);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, sheet?.name || "Sheet1");
//     XLSX.writeFile(wb, "univer-export.xlsx");
//   };

//   return (
//     <div style={{ width: "100vw", height: "100vh" }}>
//       <div style={{ padding: 8, background: "#f0f0f0" }}>
//         <input type="file" accept=".xlsx" onChange={handleImport} />
//         <button onClick={handleExport} style={{ marginLeft: 8 }}>
//           Export Excel
//         </button>
//       </div>
//       <div id="app" style={{ width: "100%", height: "calc(100% - 40px)" }} />
//     </div>
//   );
// };

// export default UniverSheet;
