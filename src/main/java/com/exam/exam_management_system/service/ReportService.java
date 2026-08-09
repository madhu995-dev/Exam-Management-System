package com.exam.exam_management_system.service;

import jakarta.servlet.http.HttpServletResponse;

public interface ReportService {

    void exportStudentsPdf(HttpServletResponse response);

    void exportStudentsExcel(HttpServletResponse response);

    void exportAttendancePdf(Long examId,
                             HttpServletResponse response);

    void exportAttendanceExcel(Long examId,
                               HttpServletResponse response);

    void exportResultsPdf(Long examId,
                          HttpServletResponse response);

    void exportResultsExcel(Long examId,
                            HttpServletResponse response);

    void exportSeatAllocationPdf(Long examId,
                                 HttpServletResponse response);

    void exportSeatAllocationExcel(Long examId,
                                   HttpServletResponse response);

    void exportHallTicketsPdf(Long examId,
                              HttpServletResponse response);

    void exportInvigilatorPdf(Long examId,
                              HttpServletResponse response);
}