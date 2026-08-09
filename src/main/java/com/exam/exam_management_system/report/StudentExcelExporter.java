package com.exam.exam_management_system.report;

import com.exam.exam_management_system.entity.Student;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.util.List;

public class StudentExcelExporter {

    private final List<Student> students;

    private final XSSFWorkbook workbook;

    private Sheet sheet;

    public StudentExcelExporter(List<Student> students) {
        this.students = students;
        this.workbook = new XSSFWorkbook();
    }

    private void writeHeader() {

        sheet = workbook.createSheet("Students");

        Row row = sheet.createRow(0);

        CellStyle style = workbook.createCellStyle();

        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 14);

        style.setFont(font);

        createCell(row,0,"ID",style);
        createCell(row,1,"Name",style);
        createCell(row,2,"Roll Number",style);
        createCell(row,3,"Department",style);
        createCell(row,4,"Email",style);
        createCell(row,5,"Phone Number",style);
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
        else{
            cell.setCellValue(String.valueOf(value));
        }

        cell.setCellStyle(style);
    }

    private void writeData(){

        int rowCount = 1;

        CellStyle style = workbook.createCellStyle();

        Font font = workbook.createFont();

        font.setFontHeightInPoints((short) 12);

        style.setFont(font);

        for(Student student : students){

            Row row = sheet.createRow(rowCount++);

            int column = 0;

            createCell(row,column++,student.getId(),style);
            createCell(row,column++,student.getFirstName()+" "+student.getLastName(),style);
            createCell(row,column++,student.getRollNumber(),style);
            createCell(row,column++,
                    student.getDepartment().getDepartmentName(),style);
            createCell(row,column++,student.getEmail(),style);
            createCell(row,column++,student.getPhoneNumber(),style);

        }

    }

    public void export(HttpServletResponse response)throws Exception{

        writeHeader();

        writeData();

        ServletOutputStream outputStream = response.getOutputStream();

        workbook.write(outputStream);

        workbook.close();

        outputStream.close();

    }

}