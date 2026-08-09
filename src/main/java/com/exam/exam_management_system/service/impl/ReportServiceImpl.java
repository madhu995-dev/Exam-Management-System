package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.entity.*;
import com.exam.exam_management_system.report.*;
import com.exam.exam_management_system.repository.*;
import com.exam.exam_management_system.service.ReportService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ResultRepository resultRepository;
    private final SeatAllocationRepository seatAllocationRepository;
    private final HallTicketRepository hallTicketRepository;
    private final InvigilatorAssignmentRepository invigilatorAssignmentRepository;

    @Override
    public void exportStudentsPdf(HttpServletResponse response) {

        try {

            response.setContentType("application/pdf");

            response.setHeader(
                    "Content-Disposition",
                    "attachment; filename=students.pdf");

            List<Student> students = studentRepository.findAll();

            StudentPdfExporter exporter =
                    new StudentPdfExporter(students);

            exporter.export(response);

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

    @Override
    public void exportStudentsExcel(HttpServletResponse response) {

        try {

            response.setContentType(
                    "application/octet-stream");

            response.setHeader(
                    "Content-Disposition",
                    "attachment; filename=students.xlsx");

            List<Student> students = studentRepository.findAll();

            StudentExcelExporter exporter =
                    new StudentExcelExporter(students);

            exporter.export(response);

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

    @Override
    public void exportAttendancePdf(
            Long examId,
            HttpServletResponse response) {

        try {

            response.setContentType("application/pdf");

            response.setHeader(
                    "Content-Disposition",
                    "attachment; filename=attendance.pdf");

            List<Attendance> attendance =
                    attendanceRepository.findByExamId(examId);

            AttendancePdfExporter exporter =
                    new AttendancePdfExporter(attendance);

            exporter.export(response);

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

    @Override
    public void exportAttendanceExcel(
            Long examId,
            HttpServletResponse response) {

        try {

            response.setContentType(
                    "application/octet-stream");

            response.setHeader(
                    "Content-Disposition",
                    "attachment; filename=attendance.xlsx");

            List<Attendance> attendance =
                    attendanceRepository.findByExamId(examId);

            AttendanceExcelExporter exporter =
                    new AttendanceExcelExporter(attendance);

            exporter.export(response);

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

    @Override
    public void exportResultsPdf(
            Long examId,
            HttpServletResponse response) {

        try {

            response.setContentType("application/pdf");

            response.setHeader(
                    "Content-Disposition",
                    "attachment; filename=results.pdf");

            List<Result> results =
                    resultRepository.findByExamId(examId);

            ResultPdfExporter exporter =
                    new ResultPdfExporter(results);

            exporter.export(response);

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

    @Override
    public void exportResultsExcel(
            Long examId,
            HttpServletResponse response) {

        try {

            response.setContentType("application/octet-stream");

            response.setHeader(
                    "Content-Disposition",
                    "attachment; filename=results.xlsx");

            List<Result> results =
                    resultRepository.findByExamId(examId);

            ResultExcelExporter exporter =
                    new ResultExcelExporter(results);

            exporter.export(response);

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

    @Override
    public void exportSeatAllocationPdf(
            Long examId,
            HttpServletResponse response) {

        try {

            response.setContentType("application/pdf");

            response.setHeader(
                    "Content-Disposition",
                    "attachment; filename=seat-allocation.pdf");

            List<SeatAllocation> allocations =
                    seatAllocationRepository.findByExamId(examId);

            SeatAllocationPdfExporter exporter =
                    new SeatAllocationPdfExporter(allocations);

            exporter.export(response);

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

    @Override
    public void exportSeatAllocationExcel(
            Long examId,
            HttpServletResponse response) {

        try {

            response.setContentType("application/octet-stream");

            response.setHeader(
                    "Content-Disposition",
                    "attachment; filename=seat-allocation.xlsx");

            List<SeatAllocation> allocations =
                    seatAllocationRepository.findByExamId(examId);

            SeatAllocationExcelExporter exporter =
                    new SeatAllocationExcelExporter(allocations);

            exporter.export(response);

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

    @Override
    public void exportHallTicketsPdf(Long examId,
                                     HttpServletResponse response) {

        try {

            response.setContentType("application/pdf");

            response.setHeader(
                    "Content-Disposition",
                    "attachment; filename=hall-tickets.pdf");

            List<HallTicket> hallTickets =
                    hallTicketRepository.findByExamId(examId);

            HallTicketPdfExporter exporter =
                    new HallTicketPdfExporter(hallTickets);

            exporter.export(response);

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

    @Override
    public void exportInvigilatorPdf(Long examId,
                                     HttpServletResponse response) {

        try {

            response.setContentType("application/pdf");

            response.setHeader(
                    "Content-Disposition",
                    "attachment; filename=invigilators.pdf");

            List<InvigilatorAssignment> assignments =
                    invigilatorAssignmentRepository.findByExamId(examId);

            InvigilatorPdfExporter exporter =
                    new InvigilatorPdfExporter(assignments);

            exporter.export(response);

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }
}