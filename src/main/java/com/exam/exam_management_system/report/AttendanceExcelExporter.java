package com.exam.exam_management_system.report;

import com.exam.exam_management_system.entity.Attendance;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.util.List;

public class AttendanceExcelExporter {

    private final List<Attendance> attendanceList;

    private final XSSFWorkbook workbook;

    private Sheet sheet;

    public AttendanceExcelExporter(List<Attendance> attendanceList) {
        this.attendanceList = attendanceList;
        this.workbook = new XSSFWorkbook();
    }

    private void writeHeader() {

        sheet = workbook.createSheet("Attendance");

        Row row = sheet.createRow(0);

        CellStyle style = workbook.createCellStyle();

        Font font = workbook.createFont();

        font.setBold(true);
        font.setFontHeightInPoints((short) 14);

        style.setFont(font);

        createCell(row, 0, "ID", style);
        createCell(row, 1, "Student", style);
        createCell(row, 2, "Roll Number", style);
        createCell(row, 3, "Faculty", style);
        createCell(row, 4, "Status", style);
        createCell(row, 5, "Remarks", style);
    }

    private void createCell(Row row,
                            int columnCount,
                            Object value,
                            CellStyle style) {

        sheet.autoSizeColumn(columnCount);

        Cell cell = row.createCell(columnCount);

        if (value instanceof Long) {
            cell.setCellValue((Long) value);
        } else {
            cell.setCellValue(String.valueOf(value));
        }

        cell.setCellStyle(style);
    }

    private void writeData() {

        int rowCount = 1;

        CellStyle style = workbook.createCellStyle();

        Font font = workbook.createFont();

        font.setFontHeightInPoints((short) 12);

        style.setFont(font);

        for (Attendance attendance : attendanceList) {

            Row row = sheet.createRow(rowCount++);

            int column = 0;

            createCell(row, column++, attendance.getId(), style);

            createCell(row, column++,
                    attendance.getStudent().getFirstName()+" "+attendance.getStudent().getLastName(), style);

            createCell(row, column++,
                    attendance.getStudent().getRollNumber(), style);

            createCell(row, column++,
                    attendance.getFaculty().getFirstName()+" "+attendance.getFaculty().getLastName(), style);

            createCell(row, column++,
                    attendance.getAttendanceStatus().name(), style);

            createCell(row, column++,
                    attendance.getRemarks() == null
                            ? "-"
                            : attendance.getRemarks(),
                    style);
        }
    }

    public void export(HttpServletResponse response) throws Exception {

        writeHeader();

        writeData();

        ServletOutputStream outputStream = response.getOutputStream();

        workbook.write(outputStream);

        workbook.close();

        outputStream.close();
    }
}