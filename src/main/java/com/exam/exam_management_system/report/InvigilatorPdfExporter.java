package com.exam.exam_management_system.report;

import com.exam.exam_management_system.entity.InvigilatorAssignment;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import jakarta.servlet.http.HttpServletResponse;

import java.awt.*;
import java.util.List;

public class InvigilatorPdfExporter {

    private final List<InvigilatorAssignment> assignments;

    public InvigilatorPdfExporter(
            List<InvigilatorAssignment> assignments) {

        this.assignments = assignments;

    }

    public void export(HttpServletResponse response) throws Exception {

        Document document = new Document(PageSize.A4);

        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font titleFont =
                FontFactory.getFont(FontFactory.HELVETICA_BOLD);

        titleFont.setSize(18);

        Paragraph title =
                new Paragraph("Invigilator Report", titleFont);

        title.setAlignment(Paragraph.ALIGN_CENTER);

        document.add(title);

        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(5);

        table.setWidthPercentage(100);

        table.setWidths(new float[]{2,4,4,3,5});

        PdfPCell cell = new PdfPCell();

        cell.setBackgroundColor(Color.LIGHT_GRAY);

        cell.setPadding(5);

        cell.setPhrase(new Phrase("ID"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Faculty"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Department"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Room"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Exam"));
        table.addCell(cell);

        for (InvigilatorAssignment assignment : assignments) {

            table.addCell(String.valueOf(assignment.getId()));

            table.addCell(
                    assignment.getFaculty().getFirstName()+" "+assignment.getFaculty().getLastName());

            table.addCell(
                    assignment.getFaculty()
                            .getDepartment()
                            .getDepartmentName());

            table.addCell(
                    assignment.getRoom()
                            .getRoomNumber());

            table.addCell(
                    assignment.getExam()
                            .getExamName());

        }

        document.add(table);

        document.close();

    }

}