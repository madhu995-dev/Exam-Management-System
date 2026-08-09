package com.exam.exam_management_system.report;

import com.exam.exam_management_system.entity.HallTicket;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import jakarta.servlet.http.HttpServletResponse;

import java.awt.*;
import java.util.List;

public class HallTicketPdfExporter {

    private final List<HallTicket> hallTickets;

    public HallTicketPdfExporter(List<HallTicket> hallTickets) {
        this.hallTickets = hallTickets;
    }

    public void export(HttpServletResponse response) throws Exception {

        Document document = new Document(PageSize.A4.rotate());

        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        titleFont.setSize(18);

        Paragraph title = new Paragraph("Hall Ticket Report", titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);

        document.add(title);
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(7);

        table.setWidthPercentage(100);

        table.setWidths(new float[]{2,4,3,4,3,3,5});

        PdfPCell cell = new PdfPCell();

        cell.setBackgroundColor(Color.LIGHT_GRAY);

        cell.setPadding(5);

        cell.setPhrase(new Phrase("ID"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Student"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Roll Number"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Hall Ticket"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Seat"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Room"));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Exam"));
        table.addCell(cell);

        for (HallTicket hallTicket : hallTickets) {

            table.addCell(String.valueOf(hallTicket.getId()));

            table.addCell(hallTicket.getStudent().getFirstName()+" "+hallTicket.getStudent().getLastName());

            table.addCell(hallTicket.getStudent().getRollNumber());

            table.addCell(hallTicket.getHallTicketNumber());

            table.addCell(
                    hallTicket.getSeatAllocation()
                            .getSeat()
                            .getSeatNumber());

            table.addCell(
                    hallTicket.getSeatAllocation()
                            .getSeat()
                            .getRoom()
                            .getRoomNumber());

            table.addCell(
                    hallTicket.getExam()
                            .getExamName());

        }

        document.add(table);

        document.close();

    }

}