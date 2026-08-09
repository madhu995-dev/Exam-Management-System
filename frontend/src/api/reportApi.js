import axiosInstance from './axiosConfig';

export const reportApi = {
  // Helper method for downloading PDF or Excel binary blob files
  downloadReport: async (url, filename) => {
    const response = await axiosInstance.get(url, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  },

  // Student Reports
  exportStudentsPdf: () => reportApi.downloadReport('/api/reports/students/pdf', 'students_report.pdf'),
  exportStudentsExcel: () => reportApi.downloadReport('/api/reports/students/excel', 'students_report.xlsx'),

  // Attendance Reports
  exportAttendancePdf: (examId) => reportApi.downloadReport(`/api/reports/attendance/${examId}/pdf`, `attendance_exam_${examId}.pdf`),
  exportAttendanceExcel: (examId) => reportApi.downloadReport(`/api/reports/attendance/${examId}/excel`, `attendance_exam_${examId}.xlsx`),

  // Result Reports
  exportResultsPdf: (examId) => reportApi.downloadReport(`/api/reports/results/${examId}/pdf`, `results_exam_${examId}.pdf`),
  exportResultsExcel: (examId) => reportApi.downloadReport(`/api/reports/results/${examId}/excel`, `results_exam_${examId}.xlsx`),

  // Seat Allocation Reports
  exportSeatAllocationPdf: (examId) => reportApi.downloadReport(`/api/reports/seat-allocation/${examId}/pdf`, `seat_allocation_exam_${examId}.pdf`),
  exportSeatAllocationExcel: (examId) => reportApi.downloadReport(`/api/reports/seat-allocation/${examId}/excel`, `seat_allocation_exam_${examId}.xlsx`),

  // Hall Tickets Report
  exportHallTicketsPdf: (examId) => reportApi.downloadReport(`/api/reports/hall-tickets/${examId}/pdf`, `hall_tickets_exam_${examId}.pdf`),

  // Invigilator Assignment Report
  exportInvigilatorPdf: (examId) => reportApi.downloadReport(`/api/reports/invigilators/${examId}/pdf`, `invigilators_exam_${examId}.pdf`),
};
