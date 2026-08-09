package com.exam.exam_management_system.report;

import com.exam.exam_management_system.entity.Attendance;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import jakarta.servlet.http.HttpServletResponse;

import java.awt.*;
import java.util.List;

public class AttendancePdfExporter {

    private final List<Attendance> attendanceList;

    public AttendancePdfExporter(List<Attendance> attendanceList) {
        this.attendanceList = attendanceList;
    }

    public void export(HttpServletResponse response) throws Exception {

        Document document = new Document(PageSize.A4);

        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);

        titleFont.setSize(18);

        Paragraph title = new Paragraph("Attendance Report", titleFont);

        title.setAlignment(Paragraph.ALIGN_CENTER);

        document.add(title);

        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(6);

        table.setWidthPercentage(100);

        table.setWidths(new float[]{2,4,3,3,3,4});

        writeHeader(table);

        writeData(table);

        document.add(table);

        document.close();

    }

    private void writeHeader(PdfPTable table){

        PdfPCell cell = new PdfPCell();

        cell.setBackgroundColor(Color.LIGHT_GRAY);

        cell.setPadding(5);

        cell.setPhrase(new Phrase("ID"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Student"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Roll No"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Faculty"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Status"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Remarks"));
        table.addCell(cell);

    }

    private void writeData(PdfPTable table){

        for(Attendance attendance : attendanceList){

            table.addCell(String.valueOf(attendance.getId()));

            table.addCell(attendance.getStudent().getFirstName()+" "+attendance.getStudent().getLastName());

            table.addCell(attendance.getStudent().getRollNumber());

            table.addCell(attendance.getFaculty().getFirstName()+attendance.getFaculty().getLastName());

            table.addCell(attendance.getAttendanceStatus().name());

            table.addCell(
                    attendance.getRemarks() == null
                            ? "-"
                            : attendance.getRemarks());

        }

    }

}