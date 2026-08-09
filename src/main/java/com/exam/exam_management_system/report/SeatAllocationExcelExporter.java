package com.exam.exam_management_system.report;

import com.exam.exam_management_system.entity.SeatAllocation;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.util.List;

public class SeatAllocationExcelExporter {

    private final List<SeatAllocation> seatAllocations;

    private final XSSFWorkbook workbook;

    private Sheet sheet;

    public SeatAllocationExcelExporter(List<SeatAllocation> seatAllocations) {

        this.seatAllocations = seatAllocations;
        this.workbook = new XSSFWorkbook();
    }

    private void writeHeader() {

        sheet = workbook.createSheet("Seat Allocation");

        Row row = sheet.createRow(0);

        CellStyle style = workbook.createCellStyle();

        Font font = workbook.createFont();

        font.setBold(true);

        font.setFontHeightInPoints((short) 14);

        style.setFont(font);

        createCell(row,0,"ID",style);
        createCell(row,1,"Student",style);
        createCell(row,2,"Roll Number",style);
        createCell(row,3,"Block",style);
        createCell(row,4,"Room",style);
        createCell(row,5,"Seat",style);
        createCell(row,6,"Exam",style);

    }

    private void createCell(Row row,
                            int columnCount,
                            Object value,
                            CellStyle style){

        sheet.autoSizeColumn(columnCount);

        Cell cell = row.createCell(columnCount);

        if(value instanceof Long){

            cell.setCellValue((Long)value);

        }else{

            cell.setCellValue(String.valueOf(value));

        }

        cell.setCellStyle(style);

    }

    private void writeData(){

        int rowCount = 1;

        CellStyle style = workbook.createCellStyle();

        Font font = workbook.createFont();

        font.setFontHeightInPoints((short)12);

        style.setFont(font);

        for(SeatAllocation allocation : seatAllocations){

            Row row = sheet.createRow(rowCount++);

            int column = 0;

            createCell(row,column++,allocation.getId(),style);

            createCell(row,column++,
                    allocation.getStudent().getFirstName()+" "+allocation.getStudent().getLastName(),
                    style);

            createCell(row,column++,
                    allocation.getStudent().getRollNumber(),
                    style);

            createCell(row,column++,
                    allocation.getSeat()
                            .getRoom()
                            .getBlock()
                            .getBlockName(),
                    style);

            createCell(row,column++,
                    allocation.getSeat()
                            .getRoom()
                            .getRoomNumber(),
                    style);

            createCell(row,column++,
                    allocation.getSeat()
                            .getSeatNumber(),
                    style);

            createCell(row,column++,
                    allocation.getExam()
                            .getExamName(),
                    style);

        }

    }

    public void export(HttpServletResponse response) throws Exception{

        writeHeader();

        writeData();

        ServletOutputStream outputStream =
                response.getOutputStream();

        workbook.write(outputStream);

        workbook.close();

        outputStream.close();

    }

}