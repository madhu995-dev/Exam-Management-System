package com.exam.exam_management_system.report;

import com.exam.exam_management_system.entity.Student;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;

import jakarta.servlet.http.HttpServletResponse;

import java.awt.*;
import java.util.List;

public class StudentPdfExporter {

    private final List<Student> students;

    public StudentPdfExporter(List<Student> students) {
        this.students = students;
    }

    public void export(HttpServletResponse response) throws Exception {

        Document document = new Document(PageSize.A4);

        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);

        titleFont.setSize(18);

        Paragraph title = new Paragraph("Student Report", titleFont);

        title.setAlignment(Paragraph.ALIGN_CENTER);

        document.add(title);

        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(5);

        table.setWidthPercentage(100);

        table.setWidths(new float[]{2,4,3,4,4});

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

        cell.setPhrase(new Phrase("Name"));

        table.addCell(cell);

        cell.setPhrase(new Phrase("Roll Number"));

        table.addCell(cell);

        cell.setPhrase(new Phrase("Department"));

        table.addCell(cell);

        cell.setPhrase(new Phrase("Email"));

        table.addCell(cell);

    }

    private void writeData(PdfPTable table){

        for(Student student : students){

            table.addCell(String.valueOf(student.getId()));

            table.addCell(student.getFirstName()+" "+student.getLastName());

            table.addCell(student.getRollNumber());

            table.addCell(student.getDepartment().getDepartmentName());

            table.addCell(student.getEmail());

        }

    }

}