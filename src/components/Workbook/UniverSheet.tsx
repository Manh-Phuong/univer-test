import React, { useEffect, useRef, useState } from "react";
import {
  LocaleType,
  mergeLocales,
  Univer,
  UniverInstanceType,
  IUniverInstanceService,
} from "@univerjs/core";
import DesignEnUS from "@univerjs/design/locale/en-US";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import DocsUIEnUS from "@univerjs/docs-ui/locale/en-US";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaUIPlugin } from "@univerjs/sheets-formula-ui";
import SheetsFormulaUIEnUS from "@univerjs/sheets-formula-ui/locale/en-US";
import { UniverSheetsNumfmtUIPlugin } from "@univerjs/sheets-numfmt-ui";
import SheetsNumfmtUIEnUS from "@univerjs/sheets-numfmt-ui/locale/en-US";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import SheetsUIEnUS from "@univerjs/sheets-ui/locale/en-US";
import SheetsEnUS from "@univerjs/sheets/locale/en-US";
import { UniverUIPlugin } from "@univerjs/ui";
import UIEnUS from "@univerjs/ui/locale/en-US";
import { UniverDrawingPlugin } from "@univerjs/drawing";
import { UniverDrawingUIPlugin } from "@univerjs/drawing-ui";
import { UniverSheetsDrawingPlugin } from "@univerjs/sheets-drawing";
import { UniverSheetsDrawingUIPlugin } from "@univerjs/sheets-drawing-ui";
import { UniverSheetsChartUIPlugin } from "@univerjs-pro/sheets-chart-ui";
import { ChartModal } from "../Chart/ChartModal";
import { ChartConfig } from "../../types/chart.types";
import { ChartList } from "../Chart/ChartList";

import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula-ui/lib/index.css";
import "@univerjs/sheets-numfmt-ui/lib/index.css";
import "@univerjs/drawing-ui/lib/index.css";
import "@univerjs/sheets-drawing-ui/lib/index.css";

import * as XLSX from "xlsx";
import { useWorkbook } from "../../hooks/useWorkbook";
import { AUTO_SAVE_INTERVAL } from "../../utils/constants";
import { SaveAsTemplateModal } from "../Template/SaveAsTemplateModal";
import { LoadDataModal } from "../Data/LoadDataModal";

interface UniverSheetProps {
  workbookId?: string;
  onBack?: () => void;
}

let univer: Univer | null = null;

export const UniverSheet: React.FC<UniverSheetProps> = ({
  workbookId,
  onBack,
}) => {
  const { fetchWorkbook, createWorkbook, updateWorkbook } = useWorkbook();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [workbookName, setWorkbookName] = useState("Untitled Workbook");

  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [showChartList, setShowChartList] = useState(false);
  const [editingChart, setEditingChart] = useState<ChartConfig | undefined>();
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [showLoadDataModal, setShowLoadDataModal] = useState(false);

  // ✅ Track current unit ID with ref instead of global variable
  const currentWorkbookUnitIdRef = useRef<string | null>(null);

  // Initialize Univer once
  useEffect(() => {
    if (!univer) {
      console.log("🎯 Initializing Univer instance");
      univer = new Univer({
        locale: LocaleType.EN_US,
        locales: {
          [LocaleType.EN_US]: mergeLocales(
            DesignEnUS,
            UIEnUS,
            DocsUIEnUS,
            SheetsEnUS,
            SheetsUIEnUS,
            SheetsFormulaUIEnUS,
            SheetsNumfmtUIEnUS
          ),
        },
      });

      univer.registerPlugin(UniverRenderEnginePlugin);
      univer.registerPlugin(UniverFormulaEnginePlugin);
      univer.registerPlugin(UniverUIPlugin, { container: "app" });
      univer.registerPlugin(UniverDocsPlugin);
      univer.registerPlugin(UniverDocsUIPlugin);
      univer.registerPlugin(UniverSheetsPlugin);
      univer.registerPlugin(UniverSheetsUIPlugin);
      univer.registerPlugin(UniverSheetsFormulaUIPlugin);
      univer.registerPlugin(UniverSheetsNumfmtUIPlugin);
      univer.registerPlugin(UniverDrawingPlugin);
      univer.registerPlugin(UniverDrawingUIPlugin);
      univer.registerPlugin(UniverSheetsDrawingPlugin);
      univer.registerPlugin(UniverSheetsDrawingUIPlugin);
      univer.registerPlugin(UniverSheetsChartUIPlugin);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, []);

  // ✅ Load or create workbook - runs when workbookId changes
  useEffect(() => {
    if (!univer) return;

    console.log("📚 Loading workbook:", workbookId);

    let isCancelled = false;
    const univerInstanceService = univer
      .__getInjector()
      .get(IUniverInstanceService);

    // ✅ Calculate the unit ID we're about to create
    const targetUnitId = workbookId
      ? `workbook-${workbookId}`
      : `workbook-new-${Date.now()}`;

    // ✅ Check if unit already exists FIRST
    const existingUnit = univerInstanceService.getUnit(targetUnitId);

    if (existingUnit) {
      console.log("♻️ Unit already exists, reusing:", targetUnitId);
      currentWorkbookUnitIdRef.current = targetUnitId;

      if (workbookId) {
        // Still fetch to update name and start autosave
        fetchWorkbook(workbookId).then((result) => {
          if (!isCancelled && result.success && result.data) {
            setWorkbookName(result.data.name);
            startAutoSave();
          }
        });
      }
      return () => {
        isCancelled = true;
        if (autoSaveTimerRef.current) {
          clearInterval(autoSaveTimerRef.current);
          autoSaveTimerRef.current = null;
        }
      };
    }

    // ✅ Dispose OLD workbook if it's different
    if (
      currentWorkbookUnitIdRef.current &&
      currentWorkbookUnitIdRef.current !== targetUnitId
    ) {
      try {
        console.log(
          "🗑️ Disposing existing workbook:",
          currentWorkbookUnitIdRef.current
        );
        univerInstanceService.disposeUnit(currentWorkbookUnitIdRef.current);
        currentWorkbookUnitIdRef.current = null;
      } catch (e) {
        console.warn("Warning disposing workbook:", e);
      }
    }

    // ✅ Clear auto-save timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }

    if (workbookId) {
      // Load existing workbook
      fetchWorkbook(workbookId).then((result) => {
        if (isCancelled || !univer) {
          console.log("⚠️ Workbook load cancelled (component unmounted)");
          return;
        }

        if (result.success && result.data) {
          console.log("✅ Workbook loaded:", result.data.name);
          setWorkbookName(result.data.name);

          if (result.data.charts) {
            setCharts(result.data.charts);
          }

          currentWorkbookUnitIdRef.current = targetUnitId;

          // ✅ Force the snapshot to use our unique ID
          const snapshotToLoad = {
            ...result.data.snapshot,
            id: targetUnitId,
          };

          console.log("🎨 Creating Univer unit with ID:", targetUnitId);
          univer.createUnit(UniverInstanceType.UNIVER_SHEET, snapshotToLoad);
          startAutoSave();
        }
      });
    } else {
      // Create new empty workbook
      if (!isCancelled) {
        console.log("📝 Creating new workbook");
        currentWorkbookUnitIdRef.current = targetUnitId;

        univer.createUnit(UniverInstanceType.UNIVER_SHEET, {
          id: targetUnitId,
          sheetOrder: ["sheet-1"],
          sheets: {
            "sheet-1": {
              id: "sheet-1",
              name: "Sheet1",
              cellData: {},
            },
          },
        });
      }
    }

    // ✅ Cleanup: Only runs when workbookId CHANGES or component unmounts
    return () => {
      console.log("🧹 Cleanup triggered for workbookId:", workbookId);
      isCancelled = true;

      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [workbookId, fetchWorkbook]); // ✅ Re-run when workbookId changes

  const startAutoSave = () => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }

    // autoSaveTimerRef.current = setInterval(() => {
    //   if (workbookId) {
    //     handleAutoSave();
    //   }
    // }, AUTO_SAVE_INTERVAL);
  };

  const handleAutoSave = async () => {
    if (!univer || isSaving || !workbookId) return;

    try {
      setIsSaving(true);
      const snapshot = getCurrentSnapshot();

      if (snapshot) {
        await updateWorkbook(workbookId, { snapshot });
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getCurrentSnapshot = () => {
    if (!univer || !currentWorkbookUnitIdRef.current) return null;

    const univerInstanceService = univer
      .__getInjector()
      .get(IUniverInstanceService);
    const workbook = univerInstanceService.getUnit(
      currentWorkbookUnitIdRef.current
    );

    if (!workbook) return null;
    return workbook.save();
  };

  const handleSave = async () => {
    if (!univer) return;

    const snapshot = getCurrentSnapshot();
    if (!snapshot) return;

    try {
      setIsSaving(true);

      if (workbookId) {
        const result = await updateWorkbook(workbookId, {
          name: workbookName,
          snapshot,
          charts,
        });
        if (result.success) {
          setLastSaved(new Date());
          alert("Workbook saved!");
        } else {
          alert(`Save failed: ${result.error}`);
        }
      } else {
        const result = await createWorkbook({
          name: workbookName,
          snapshot,
        });
        if (result.success) {
          alert("Workbook created!");
          if (onBack) onBack();
        } else {
          alert(`Create failed: ${result.error}`);
        }
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !univer) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });

      const sheetName = wb.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
        header: 1,
      });

      // ✅ Dispose existing workbook before import
      if (currentWorkbookUnitIdRef.current) {
        try {
          const univerInstanceService = univer!
            .__getInjector()
            .get(IUniverInstanceService);
          univerInstanceService.disposeUnit(currentWorkbookUnitIdRef.current);
        } catch (e) {
          console.warn("Error disposing before import:", e);
        }
      }

      const newUnitId = `workbook-import-${Date.now()}`;
      currentWorkbookUnitIdRef.current = newUnitId;

      const univerData = {
        id: newUnitId,
        sheetOrder: ["sheet-1"],
        sheets: {
          "sheet-1": {
            id: "sheet-1",
            name: sheetName,
            cellData: sheet.reduce((rows: any, row: any[], r: number) => {
              rows[r] = {};
              row.forEach((cell, c) => {
                if (cell !== undefined && cell !== null && cell !== "") {
                  rows[r][c] = { v: cell };
                }
              });
              return rows;
            }, {}),
          },
        },
      };

      univer!.createUnit(UniverInstanceType.UNIVER_SHEET, univerData);
      setWorkbookName(file.name.replace(/\.[^/.]+$/, ""));
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    if (!univer) return;

    const snapshot = getCurrentSnapshot();
    if (!snapshot) return;

    const firstSheetId = snapshot.sheetOrder?.[0];
    const sheet = snapshot.sheets?.[firstSheetId];

    const aoa: any[][] = [];
    if (sheet?.cellData) {
      Object.entries(sheet.cellData).forEach(([r, row]) => {
        const rowIdx = Number(r);
        aoa[rowIdx] = aoa[rowIdx] || [];
        Object.entries(row as any).forEach(([c, cell]) => {
          aoa[rowIdx][Number(c)] = (cell as any).v;
        });
      });
    }

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheet?.name || "Sheet1");
    XLSX.writeFile(wb, `${workbookName}.xlsx`);
  };

  const handleSaveAsTemplate = () => {
    const snapshot = getCurrentSnapshot();
    if (!snapshot) {
      alert("No data to save as template");
      return;
    }
    setShowSaveTemplateModal(true);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "12px 24px",
          background: "#fff",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {onBack && (
          <button
            onClick={onBack}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f5f5f5",
              color: "#333",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ← Back
          </button>
        )}

        <input
          type="text"
          value={workbookName}
          onChange={(e) => setWorkbookName(e.target.value)}
          placeholder="Workbook name"
          style={{
            flex: 1,
            maxWidth: "400px",
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        />

        {/* Primary Actions */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            padding: "8px 16px",
            backgroundColor: isSaving ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: isSaving ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>

        {/* Template Actions */}
        <button
          onClick={handleSaveAsTemplate}
          style={{
            padding: "8px 16px",
            backgroundColor: "#9c27b0",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          💾 Save as Template
        </button>

        {/* File Actions */}
        <label
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "#fff",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Import
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImport}
            style={{ display: "none" }}
          />
        </label>

        <button
          onClick={handleExport}
          style={{
            padding: "8px 16px",
            backgroundColor: "#17a2b8",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Export
        </button>

        <button
          onClick={() => setShowLoadDataModal(true)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ff9800",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Load Data
        </button>

        {/* Chart Actions */}
        <button
          onClick={() => setIsChartModalOpen(true)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#6f42c1",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          + Chart
        </button>

        <button
          onClick={() => setShowChartList(!showChartList)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#fd7e14",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Charts ({charts.length})
        </button>

        {lastSaved && (
          <span style={{ fontSize: "12px", color: "#999", marginLeft: "auto" }}>
            Last saved: {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>

      {showSaveTemplateModal && (
        <SaveAsTemplateModal
          snapshot={getCurrentSnapshot()}
          onClose={() => setShowSaveTemplateModal(false)}
          onSuccess={() => {
            setShowSaveTemplateModal(false);
            alert("Template created successfully!");
          }}
        />
      )}

      {showLoadDataModal && (
        <LoadDataModal
          currentSnapshot={getCurrentSnapshot()}
          onClose={() => setShowLoadDataModal(false)}
          onDataLoaded={(newSnapshot) => {
            const sheet = newSnapshot.sheets["sheet-1"];

            // ✅ Dùng reduce thay vì Math.max(...array)
            const rowIndices = Object.keys(sheet.cellData).map(Number);
            const maxRow = rowIndices.reduce(
              (max, val) => Math.max(max, val),
              0
            );

            // Tính max column
            const allCols: number[] = [];
            Object.values(sheet.cellData).forEach((row: any) => {
              const cols = Object.keys(row).map(Number);
              cols.forEach((c) => allCols.push(c));
            });
            const maxCol =
              allCols.length > 0
                ? allCols.reduce((max, val) => Math.max(max, val), 0)
                : 0;

            // Set config
            if (!sheet.rowCount || sheet.rowCount < maxRow) {
              sheet.rowCount = maxRow + 100;
            }
            if (!sheet.columnCount || sheet.columnCount < maxCol) {
              sheet.columnCount = maxCol + 10;
            }

            console.log(
              `📊 Setting sheet config: rowCount=${sheet.rowCount}, columnCount=${sheet.columnCount}`
            );

            // Dispose current unit
            if (currentWorkbookUnitIdRef.current && univer) {
              const univerInstanceService = univer
                .__getInjector()
                .get(IUniverInstanceService);
              try {
                univerInstanceService.disposeUnit(
                  currentWorkbookUnitIdRef.current
                );
              } catch (e) {
                console.warn("Error disposing:", e);
              }
            }

            const newUnitId = `workbook-loaded-${Date.now()}`;
            currentWorkbookUnitIdRef.current = newUnitId;

            univer!.createUnit(UniverInstanceType.UNIVER_SHEET, {
              ...newSnapshot,
              id: newUnitId,
            });

            setTimeout(() => {
              const univerInstanceService = univer!
                .__getInjector()
                .get(IUniverInstanceService);
              const unit = univerInstanceService.getUnit(newUnitId);
              const saved = unit?.save();
              if (saved) {
                const actualRows = Object.keys(
                  saved.sheets["sheet-1"].cellData
                ).length;
                console.log(
                  `✅ Verification: ${actualRows} rows loaded (expected ${rowIndices.length})`
                );
              }
            }, 500);

            setShowLoadDataModal(false);
            alert(`Data loaded! ${rowIndices.length} rows`);
          }}
        />
      )}

      <div id="app" style={{ flex: 1, overflow: "hidden" }} />
    </div>
  );
};
