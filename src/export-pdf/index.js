import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { report } from "./data.js";

const doc = new jsPDF("l", "mm", "a4"); // Sử dụng khổ ngang (landscape) để có thêm không gian

// Lấy tất cả key bao gồm cả rawMsg
const headers = Object.keys(report[0]);

const rows = report.map(item =>
  headers.map(h => item[h])
);

autoTable(doc, {
  head: [headers],
  body: rows,
  theme: 'grid',
  styles: { 
    fontSize: 8,
    cellPadding: 2 
  },
  columnStyles: {
    // Tìm index của cột rawMsg để cấu hình
    [headers.indexOf("rawMsg")]: {
      cellWidth: 80,      // Giới hạn độ rộng cột rawMsg
      overflow: 'ellipsize', // Cắt bớt bằng dấu "..." nếu quá dài
      minCellHeight: 10      // Giữ độ cao hàng cố định
    }
  },
  headStyles: { fillColor: [41, 128, 185] },
  // Đảm bảo nội dung không bị rớt dòng
  didParseCell: function(data) {
    if (data.column.key === headers.indexOf("rawMsg")) {
      // Thay thế các ký tự xuống dòng (nếu có) bằng khoảng trắng
      if (typeof data.cell.raw === 'string') {
        data.cell.text = [data.cell.raw.replace(/[\r\n]+/g, " ")];
      }
    }
  }
});

doc.save(`${new Date().toISOString().slice(0, 10)}-report.pdf`);