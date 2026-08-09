package com.exam.exam_management_system.report;

import com.exam.exam_management_system.entity.Result;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import jakarta.servlet.http.HttpServletResponse;

import java.awt.*;
import java.util.List;

public class ResultPdfExporter {

    private final List<Result> results;

    public ResultPdfExporter(List<Result> results) {
        this.results = results;
    }

    public void export(HttpServletResponse response) throws Exception {

        Document document = new Document(PageSize.A4.rotate());

        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);

        titleFont.setSize(18);

        Paragraph title = new Paragraph("Result Report", titleFont);

        title.setAlignment(Paragraph.ALIGN_CENTER);

        document.add(title);

        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(10);

        table.setWidthPercentage(100);

        table.setWidths(new float[]{2,4,3,2,2,2,2,2,2,3});

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

        cell.setPhrase(new Phrase("Internal"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("External"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Practical"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Total"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Grade"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Result"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Percentage"));
        table.addCell(cell);

    }

    private void writeData(PdfPTable table){

        for(Result result : results){

            table.addCell(String.valueOf(result.getId()));

            table.addCell(result.getStudent().getFirstName()+" "+result.getStudent().getLastName());

            table.addCell(result.getStudent().getRollNumber());

            table.addCell(String.valueOf(result.getInternalMarks()));

            table.addCell(String.valueOf(result.getExternalMarks()));

            table.addCell(String.valueOf(result.getPracticalMarks()));

            table.addCell(String.valueOf(result.getTotalMarks()));

            table.addCell(result.getGrade());

            table.addCell(result.getPass() ? "PASS" : "FAIL");

            table.addCell(result.getPercentage() + "%");

        }

    }

}