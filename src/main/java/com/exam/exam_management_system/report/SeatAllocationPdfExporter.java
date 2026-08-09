package com.exam.exam_management_system.report;

import com.exam.exam_management_system.entity.SeatAllocation;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import jakarta.servlet.http.HttpServletResponse;

import java.awt.*;
import java.util.List;

public class SeatAllocationPdfExporter {

    private final List<SeatAllocation> seatAllocations;

    public SeatAllocationPdfExporter(List<SeatAllocation> seatAllocations) {
        this.seatAllocations = seatAllocations;
    }

    public void export(HttpServletResponse response) throws Exception {

        Document document = new Document(PageSize.A4.rotate());

        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);

        titleFont.setSize(18);

        Paragraph title = new Paragraph("Seat Allocation Report", titleFont);

        title.setAlignment(Paragraph.ALIGN_CENTER);

        document.add(title);

        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(7);

        table.setWidthPercentage(100);

        table.setWidths(new float[]{2,4,3,4,4,3,5});

        writeHeader(table);

        writeData(table);

        document.add(table);

        document.close();
    }

    private void writeHeader(PdfPTable table) {

        PdfPCell cell = new PdfPCell();

        cell.setBackgroundColor(Color.LIGHT_GRAY);

        cell.setPadding(5);

        cell.setPhrase(new Phrase("ID"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Student"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Roll Number"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Block"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Room"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Seat"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Exam"));
        table.addCell(cell);
    }

    private void writeData(PdfPTable table) {

        for (SeatAllocation allocation : seatAllocations) {

            table.addCell(String.valueOf(allocation.getId()));

            table.addCell(allocation.getStudent().getFirstName()+" "+allocation.getStudent().getLastName());

            table.addCell(allocation.getStudent().getRollNumber());

            table.addCell(
                    allocation.getSeat()
                            .getRoom()
                            .getBlock()
                            .getBlockName());

            table.addCell(
                    allocation.getSeat()
                            .getRoom()
                            .getRoomNumber());

            table.addCell(
                    allocation.getSeat()
                            .getSeatNumber());

            table.addCell(
                    allocation.getExam()
                            .getExamName());
        }
    }
}