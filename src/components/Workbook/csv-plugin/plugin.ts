// import type {
//   ISetRangeValuesMutationParams,
//   ISetWorksheetColumnCountMutationParams,
//   ISetWorksheetRowCountMutationParams,
// } from "@univerjs/preset-sheets-core";
// import type { ICommand, IMutationInfo, Workbook } from "@univerjs/presets";
// import { FolderIcon } from "@univerjs/icons";
// import {
//   ComponentManager,
//   IMenuManagerService,
//   MenuItemType,
//   RibbonStartGroup,
//   SetRangeValuesMutation,
//   SetRangeValuesUndoMutationFactory,
//   SetWorksheetColumnCountMutation,
//   SetWorksheetColumnCountUndoMutationFactory,
//   SetWorksheetRowCountMutation,
//   SetWorksheetRowCountUndoMutationFactory,
// } from "@univerjs/preset-sheets-core";
// import {
//   CommandType,
//   covertCellValues,
//   ICommandService,
//   Inject,
//   Injector,
//   IUndoRedoService,
//   IUniverInstanceService,
//   Plugin,
//   sequenceExecute,
//   UniverInstanceType,
// } from "@univerjs/presets";
// import { waitUserSelectCSVFile } from "./utils";

// export class ImportCSVButtonPlugin extends Plugin {
//   static override pluginName = "import-csv-plugin";

//   constructor(
//     @Inject(Injector) readonly _injector: Injector,
//     @Inject(IMenuManagerService)
//     private readonly menuManagerService: IMenuManagerService,
//     @Inject(ICommandService) private readonly commandService: ICommandService,
//     @Inject(ComponentManager)
//     private readonly componentManager: ComponentManager
//   ) {
//     super();
//   }

//   override onStarting() {
//     this.componentManager.register("FolderIcon", FolderIcon);

//     const buttonId = "import-csv-button";

//     const command: ICommand = {
//       type: CommandType.OPERATION,
//       id: buttonId,
//       handler: (accessor) => {
//         const univerInstanceService = accessor.get(IUniverInstanceService);
//         const commandService = accessor.get(ICommandService);
//         const undoRedoService = accessor.get(IUndoRedoService);

//         const worksheet = univerInstanceService
//           .getCurrentUnitOfType<Workbook>(UniverInstanceType.UNIVER_SHEET)!
//           .getActiveSheet();
//         const unitId = worksheet.getUnitId();
//         const subUnitId = worksheet.getSheetId();

//         return waitUserSelectCSVFile(({ data, rowsCount, colsCount }) => {
//           const redoMutations: IMutationInfo[] = [];
//           const undoMutations: IMutationInfo[] = [];

//           // Set row count
//           const setRowCountMutationRedoParams: ISetWorksheetRowCountMutationParams =
//             {
//               unitId,
//               subUnitId,
//               rowCount: rowsCount,
//             };
//           const setRowCountMutationUndoParams =
//             SetWorksheetRowCountUndoMutationFactory(
//               accessor,
//               setRowCountMutationRedoParams
//             );
//           redoMutations.push({
//             id: SetWorksheetRowCountMutation.id,
//             params: setRowCountMutationRedoParams,
//           });
//           undoMutations.push({
//             id: SetWorksheetRowCountMutation.id,
//             params: setRowCountMutationUndoParams,
//           });

//           // Set column count
//           const setColumnCountMutationRedoParams: ISetWorksheetColumnCountMutationParams =
//             {
//               unitId,
//               subUnitId,
//               columnCount: colsCount,
//             };
//           const setColumnCountMutationUndoParams =
//             SetWorksheetColumnCountUndoMutationFactory(
//               accessor,
//               setColumnCountMutationRedoParams
//             );
//           redoMutations.push({
//             id: SetWorksheetColumnCountMutation.id,
//             params: setColumnCountMutationRedoParams,
//           });
//           undoMutations.unshift({
//             id: SetWorksheetColumnCountMutation.id,
//             params: setColumnCountMutationUndoParams,
//           });

//           // Set cell values
//           const cellValue = covertCellValues(data, {
//             startColumn: 0,
//             startRow: 0,
//             endColumn: colsCount - 1,
//             endRow: rowsCount - 1,
//           });

//           const setRangeValuesMutationRedoParams: ISetRangeValuesMutationParams =
//             {
//               unitId,
//               subUnitId,
//               cellValue,
//             };
//           const setRangeValuesMutationUndoParams =
//             SetRangeValuesUndoMutationFactory(
//               accessor,
//               setRangeValuesMutationRedoParams
//             );
//           redoMutations.push({
//             id: SetRangeValuesMutation.id,
//             params: setRangeValuesMutationRedoParams,
//           });
//           undoMutations.unshift({
//             id: SetRangeValuesMutation.id,
//             params: setRangeValuesMutationUndoParams,
//           });

//           const result = sequenceExecute(redoMutations, commandService);

//           if (result.result) {
//             undoRedoService.pushUndoRedo({
//               unitID: unitId,
//               undoMutations,
//               redoMutations,
//             });
//             return true;
//           }

//           return false;
//         });
//       },
//     };

//     const menuItemFactory = () => ({
//       id: buttonId,
//       title: "Import CSV",
//       tooltip: "Import CSV",
//       icon: "FolderIcon",
//       type: MenuItemType.BUTTON,
//     });

//     this.menuManagerService.mergeMenu({
//       [RibbonStartGroup.OTHERS]: {
//         [buttonId]: {
//           order: 10,
//           menuItemFactory,
//         },
//       },
//     });

//     this.commandService.registerCommand(command);
//   }
// }
