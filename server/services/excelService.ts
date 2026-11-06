import ExcelJS from 'exceljs';
import { ProjectState } from '../../src/types/index.ts';

/**
 * Sanitizes input text against CSV/Excel formula injection (CWE-1236).
 * Strips or prefixes leading '=', '+', '-', '@', '\t', '\r' characters.
 */
function sanitizeExcelValue(value: any): any {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (/^[=+\-@\t\r]/.test(trimmed)) {
    return `'${trimmed}`; // Prefix single quote to treat as literal string in Excel
  }
  return trimmed;
}

export async function generateEnterpriseExcelWorkbook(state: ProjectState): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'NexusGovernance AI - Enterprise Telemetry Engine';
  workbook.created = new Date();
  workbook.modified = new Date();

  // -------------------------------------------------------------
  // TAB 1: Financial & EVM Summary
  // -------------------------------------------------------------
  const summarySheet = workbook.addWorksheet('EVM & Financial Summary', {
    views: [{ showGridLines: true }],
  });

  // Title block
  summarySheet.mergeCells('A1:F1');
  const titleCell = summarySheet.getCell('A1');
  titleCell.value = `${sanitizeExcelValue(state.name)} - EVM Financial Telemetry`;
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E293B' }, // Slate 800
  };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  summarySheet.getRow(1).height = 36;

  // Metadata block
  summarySheet.getCell('A2').value = 'Project Code:';
  summarySheet.getCell('B2').value = sanitizeExcelValue(state.code);
  summarySheet.getCell('D2').value = 'Report Timestamp:';
  summarySheet.getCell('E2').value = new Date().toISOString();
  summarySheet.getRow(2).font = { italic: true, size: 10, color: { argb: 'FF64748B' } };

  // KPI Headers
  summarySheet.getRow(4).values = [
    'Earned Value Metric (PMBOK 7)',
    'Acronym',
    'Current Value ($ / Index)',
    'Baseline / Target',
    'Variance ($ / %)',
    'Governance Status',
  ];
  summarySheet.getRow(4).height = 26;
  summarySheet.getRow(4).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  summarySheet.getRow(4).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' },
  };

  const evmRows = [
    ['Budget at Completion', 'BAC', state.evm.bac, state.baselineBudget, 0, 'BASELINE LOCKED'],
    ['Planned Value', 'PV', state.evm.pv, 420000, 0, 'SCHEDULE BASELINE'],
    ['Earned Value', 'EV', state.evm.ev, 420000, state.evm.sv, 'SCHEDULE LAG'],
    ['Actual Cost', 'AC', state.evm.ac, 385000, state.evm.cv, 'OVER BUDGET'],
    ['Cost Variance (EV - AC)', 'CV', state.evm.cv, 0, state.evm.cv, state.evm.cv < 0 ? 'CRITICAL OVERRUN' : 'FAVORABLE'],
    ['Schedule Variance (EV - PV)', 'SV', state.evm.sv, 0, state.evm.sv, state.evm.sv < 0 ? 'DELAY DETECTED' : 'ON TRACK'],
    ['Cost Performance Index (EV / AC)', 'CPI', state.evm.cpi, 1.0, state.evm.cpi - 1.0, state.evm.cpi < 1.0 ? 'INEFFICIENT' : 'EFFICIENT'],
    ['Schedule Performance Index (EV / PV)', 'SPI', state.evm.spi, 1.0, state.evm.spi - 1.0, state.evm.spi < 1.0 ? 'BEHIND SCHEDULE' : 'AHEAD'],
    ['Estimate at Completion (BAC / CPI)', 'EAC', state.evm.eac, state.evm.bac, state.evm.projectedOverrun, 'PROJECTED OVERRUN'],
    ['Variance at Completion (BAC - EAC)', 'VAC', state.evm.vac, 0, state.evm.vac, 'FORECAST VARIANCE'],
    ['To-Complete Performance Index', 'TCPI', state.evm.tcpi, 1.0, state.evm.tcpi - 1.0, 'REQUIRED VELOCITY'],
  ];

  evmRows.forEach((row, idx) => {
    const rowNum = 5 + idx;
    const addedRow = summarySheet.getRow(rowNum);
    addedRow.values = row;
    addedRow.height = 22;

    // Formatting currency vs index
    const isIndex = ['CPI', 'SPI', 'TCPI'].includes(row[1] as string);
    const valCell = addedRow.getCell(3);
    if (isIndex) {
      valCell.numFmt = '0.000';
    } else {
      valCell.numFmt = '"$"#,##0';
    }

    const baselineCell = addedRow.getCell(4);
    if (isIndex) {
      baselineCell.numFmt = '0.000';
    } else {
      baselineCell.numFmt = '"$"#,##0';
    }

    const varianceCell = addedRow.getCell(5);
    if (isIndex) {
      varianceCell.numFmt = '+0.000;-0.000;0.000';
    } else {
      varianceCell.numFmt = '"$"#,##0;[Red]("$"#,##0);"-"';
    }

    // Status cell coloring
    const statusCell = addedRow.getCell(6);
    statusCell.alignment = { horizontal: 'center' };
    if (String(row[5]).includes('CRITICAL') || String(row[5]).includes('OVERRUN') || String(row[5]).includes('DELAY')) {
      statusCell.font = { bold: true, color: { argb: 'FFDC2626' } };
    } else if (String(row[5]).includes('FAVORABLE') || String(row[5]).includes('ON TRACK')) {
      statusCell.font = { bold: true, color: { argb: 'FF16A34A' } };
    }
  });

  // Native Excel formula summary box
  const formulaStartRow = 5 + evmRows.length + 2;
  summarySheet.getCell(`A${formulaStartRow}`).value = 'Financial Totals (Computed by Native Excel Formulas):';
  summarySheet.getCell(`A${formulaStartRow}`).font = { bold: true, size: 12 };

  summarySheet.getCell(`B${formulaStartRow + 1}`).value = 'Total Actual Spend:';
  summarySheet.getCell(`C${formulaStartRow + 1}`).value = { formula: 'C8' }; // References AC
  summarySheet.getCell(`C${formulaStartRow + 1}`).numFmt = '"$"#,##0';
  summarySheet.getCell(`C${formulaStartRow + 1}`).font = { bold: true };

  summarySheet.getCell(`B${formulaStartRow + 2}`).value = 'Average Performance Index:';
  summarySheet.getCell(`C${formulaStartRow + 2}`).value = { formula: 'AVERAGE(C11:C12)' }; // Average of CPI and SPI
  summarySheet.getCell(`C${formulaStartRow + 2}`).numFmt = '0.000';
  summarySheet.getCell(`C${formulaStartRow + 2}`).font = { bold: true };

  summarySheet.columns = [
    { width: 38 },
    { width: 14 },
    { width: 22 },
    { width: 22 },
    { width: 20 },
    { width: 24 },
  ];

  // -------------------------------------------------------------
  // TAB 2: Itemized Timesheet Records
  // -------------------------------------------------------------
  const timesheetSheet = workbook.addWorksheet('Timesheet Records', {
    views: [{ showGridLines: true }],
  });

  timesheetSheet.getRow(1).values = [
    'Timesheet ID',
    'Member ID',
    'Member Name',
    'Date',
    'WBS Code',
    'Task Title',
    'Category',
    'Hours Logged',
    'Hourly Rate ($)',
    'Total Cost ($)',
    'Approval Status',
    'Approver',
    'Audit Notes',
  ];
  timesheetSheet.getRow(1).height = 28;
  timesheetSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  timesheetSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0284C7' }, // Sky 600
  };

  state.timesheets.forEach((ts, idx) => {
    const rowNum = 2 + idx;
    const row = timesheetSheet.getRow(rowNum);
    row.values = [
      sanitizeExcelValue(ts.id),
      sanitizeExcelValue(ts.memberId),
      sanitizeExcelValue(ts.memberName),
      sanitizeExcelValue(ts.date),
      sanitizeExcelValue(ts.wbsCode),
      sanitizeExcelValue(ts.wbsTitle),
      sanitizeExcelValue(ts.category),
      ts.hours,
      ts.hourlyRate,
      { formula: `H${rowNum}*I${rowNum}` }, // Native formula Hours * Rate
      sanitizeExcelValue(ts.status),
      sanitizeExcelValue(ts.approvedBy || 'Pending'),
      sanitizeExcelValue(ts.notes),
    ];
    row.height = 20;

    row.getCell(8).numFmt = '0.0';
    row.getCell(9).numFmt = '"$"#,##0.00';
    row.getCell(10).numFmt = '"$"#,##0.00';
  });

  // Timesheet Totals Row with native SUM and AVERAGE
  const tsLastRow = state.timesheets.length + 1;
  const tsTotalRow = tsLastRow + 1;
  const tsSummary = timesheetSheet.getRow(tsTotalRow);
  tsSummary.getCell(6).value = 'TOTALS & AVERAGES:';
  tsSummary.getCell(6).font = { bold: true };
  tsSummary.getCell(8).value = { formula: `SUM(H2:H${tsLastRow})` };
  tsSummary.getCell(8).font = { bold: true };
  tsSummary.getCell(8).numFmt = '0.0';
  tsSummary.getCell(9).value = { formula: `AVERAGE(I2:I${tsLastRow})` };
  tsSummary.getCell(9).font = { bold: true };
  tsSummary.getCell(9).numFmt = '"$"#,##0.00';
  tsSummary.getCell(10).value = { formula: `SUM(J2:J${tsLastRow})` };
  tsSummary.getCell(10).font = { bold: true, color: { argb: 'FF0F172A' } };
  tsSummary.getCell(10).numFmt = '"$"#,##0.00';
  tsSummary.height = 24;
  tsSummary.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE2E8F0' },
  };

  timesheetSheet.columns = [
    { width: 16 },
    { width: 14 },
    { width: 20 },
    { width: 14 },
    { width: 14 },
    { width: 34 },
    { width: 18 },
    { width: 16 },
    { width: 16 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 44 },
  ];

  // -------------------------------------------------------------
  // TAB 3: Expense Ledger
  // -------------------------------------------------------------
  const expenseSheet = workbook.addWorksheet('Expense Ledger', {
    views: [{ showGridLines: true }],
  });

  expenseSheet.getRow(1).values = [
    'Expense ID',
    'Member Name',
    'Date Incurred',
    'Expense Category',
    'Description',
    'Billable',
    'Currency',
    'Amount ($)',
    'Approval Status',
    'Approver',
    'Receipt Reference',
  ];
  expenseSheet.getRow(1).height = 28;
  expenseSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  expenseSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF059669' }, // Emerald 600
  };

  state.expenses.forEach((exp, idx) => {
    const rowNum = 2 + idx;
    const row = expenseSheet.getRow(rowNum);
    row.values = [
      sanitizeExcelValue(exp.id),
      sanitizeExcelValue(exp.memberName),
      sanitizeExcelValue(exp.date),
      sanitizeExcelValue(exp.category),
      sanitizeExcelValue(exp.description),
      exp.billable ? 'YES' : 'NO',
      sanitizeExcelValue(exp.currency),
      exp.amount,
      sanitizeExcelValue(exp.status),
      sanitizeExcelValue(exp.approver || 'Awaiting Review'),
      sanitizeExcelValue(exp.receiptName),
    ];
    row.height = 20;
    row.getCell(8).numFmt = '"$"#,##0.00';
  });

  // Expense Totals Row
  const expLastRow = state.expenses.length + 1;
  const expTotalRow = expLastRow + 1;
  const expSummary = expenseSheet.getRow(expTotalRow);
  expSummary.getCell(5).value = 'TOTAL EXPENSES:';
  expSummary.getCell(5).font = { bold: true };
  expSummary.getCell(8).value = { formula: `SUM(H2:H${expLastRow})` };
  expSummary.getCell(8).font = { bold: true };
  expSummary.getCell(8).numFmt = '"$"#,##0.00';
  expSummary.height = 24;
  expSummary.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE2E8F0' },
  };

  expenseSheet.columns = [
    { width: 16 },
    { width: 20 },
    { width: 16 },
    { width: 22 },
    { width: 42 },
    { width: 14 },
    { width: 14 },
    { width: 20 },
    { width: 18 },
    { width: 20 },
    { width: 34 },
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
