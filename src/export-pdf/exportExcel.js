import * as XLSX from "xlsx";
import { report } from "./data.js";

// Lấy tất cả headers từ data
const headers = Object.keys(report[0]);

// Tạo worksheet từ data
const ws = XLSX.utils.json_to_sheet(report, { header: headers });

// Cấu hình độ rộng cột
const colWidths = headers.map(h => {
  if (h === "rawMsg") return { wch: 60 };  // Cột rawMsg rộng hơn
  return { wch: Math.max(h.length + 2, 15) }; // Các cột khác tự động
});
ws["!cols"] = colWidths;

// Tạo workbook và thêm worksheet
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Report");

// Xuất file
const fileName = `${new Date().toISOString().slice(0, 10)}-report.xlsx`;
XLSX.writeFile(wb, fileName);