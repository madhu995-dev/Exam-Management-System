package com.exam.exam_management_system.service.impl;
import com.exam.exam_management_system.dto.*;
import com.exam.exam_management_system.service.DashboardService;
import com.exam.exam_management_system.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.exam.exam_management_system.enums.AttendanceStatus;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final DepartmentRepository departmentRepository;

    private final StudentRepository studentRepository;

    private final FacultyRepository facultyRepository;

    private final BlockRepository blockRepository;

    private final RoomRepository roomRepository;

    private final SubjectRepository subjectRepository;

    private final ExaminationSeriesRepository examinationSeriesRepository;

    private final ExamRepository examRepository;

    private final SeatAllocationRepository seatAllocationRepository;

    private final HallTicketRepository hallTicketRepository;

    private final ResultRepository resultRepository;

    private final AttendanceRepository attendanceRepository;

    @Override
    public AdminDashboardResponseDto getAdminDashboard() {

        long totalDepartments = departmentRepository.count();

        long totalStudents = studentRepository.count();

        long totalFaculty = facultyRepository.count();

        long totalBlocks = blockRepository.count();

        long totalRooms = roomRepository.count();

        long totalSubjects = subjectRepository.count();

        long totalExamSeries = examinationSeriesRepository.count();

        long totalExams = examRepository.count();

        long totalSeatAllocations = seatAllocationRepository.count();

        long totalHallTickets = hallTicketRepository.count();

        long totalResults = resultRepository.count();

        long presentStudents =
                attendanceRepository.countByAttendanceStatus(
                        AttendanceStatus.PRESENT);

        long absentStudents =
                attendanceRepository.countByAttendanceStatus(
                        AttendanceStatus.ABSENT);

        long passStudents =
                resultRepository.countByPass(true);

        long failStudents =
                resultRepository.countByPass(false);

        double passPercentage = 0;

        double failPercentage = 0;

        if (totalResults > 0) {

            passPercentage =
                    (passStudents * 100.0) / totalResults;

            failPercentage =
                    (failStudents * 100.0) / totalResults;
        }

        return AdminDashboardResponseDto.builder()
                .totalDepartments(totalDepartments)
                .totalStudents(totalStudents)
                .totalFaculty(totalFaculty)
                .totalBlocks(totalBlocks)
                .totalRooms(totalRooms)
                .totalSubjects(totalSubjects)
                .totalExamSeries(totalExamSeries)
                .totalExams(totalExams)
                .totalSeatAllocations(totalSeatAllocations)
                .totalHallTickets(totalHallTickets)
                .totalResults(totalResults)
                .presentStudents(presentStudents)
                .absentStudents(absentStudents)
                .passStudents(passStudents)
                .failStudents(failStudents)
                .passPercentage(passPercentage)
                .failPercentage(failPercentage)
                .build();

    }

}