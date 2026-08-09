package com.exam.exam_management_system.report;

import com.exam.exam_management_system.entity.Result;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.util.List;

public class ResultExcelExporter {

    private final List<Result> results;

    private final XSSFWorkbook workbook;

    private Sheet sheet;

    public ResultExcelExporter(List<Result> results) {

        this.results = results;
        this.workbook = new XSSFWorkbook();

    }

    private void writeHeader() {

        sheet = workbook.createSheet("Results");

        Row row = sheet.createRow(0);

        CellStyle style = workbook.createCellStyle();

        Font font = workbook.createFont();

        font.setBold(true);

        font.setFontHeightInPoints((short) 14);

        style.setFont(font);

        createCell(row,0,"ID",style);
        createCell(row,1,"Student",style);
        createCell(row,2,"Roll Number",style);
        createCell(row,3,"Internal",style);
        createCell(row,4,"External",style);
        createCell(row,5,"Practical",style);
        createCell(row,6,"Total",style);
        createCell(row,7,"Percentage",style);
        createCell(row,8,"Grade",style);
        createCell(row,9,"Result",style);

    }

    private void createCell(Row row,
                            int columnCount,
                            Object value,
                            CellStyle style){

        sheet.autoSizeColumn(columnCount);

        Cell cell = row.createCell(columnCount);

        if(value instanceof Long){

            cell.setCellValue((Long)value);

        }
        else if(value instanceof Integer){

            cell.setCellValue((Integer)value);

        }
        else if(value instanceof Double){

            cell.setCellValue((Double)value);

        }
        else{

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

        for(Result result : results){

            Row row = sheet.createRow(rowCount++);

            int column = 0;

            createCell(row,column++,result.getId(),style);

            createCell(row,column++,
                    result.getStudent().getFirstName()+" "+result.getStudent().getLastName(),
                    style);

            createCell(row,column++,
                    result.getStudent().getRollNumber(),
                    style);

            createCell(row,column++,
                    result.getInternalMarks(),
                    style);

            createCell(row,column++,
                    result.getExternalMarks(),
                    style);

            createCell(row,column++,
                    result.getPracticalMarks(),
                    style);

            createCell(row,column++,
                    result.getTotalMarks(),
                    style);

            createCell(row,column++,
                    result.getPercentage(),
                    style);

            createCell(row,column++,
                    result.getGrade(),
                    style);

            createCell(row,column++,
                    result.getPass() ? "PASS" : "FAIL",
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