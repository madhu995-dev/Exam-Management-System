package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.ResultResponseDto;
import com.exam.exam_management_system.entity.Result;
import org.springframework.stereotype.Component;

@Component
public class ResultMapper {

    public ResultResponseDto toResponseDto(Result result) {

        ResultResponseDto dto = new ResultResponseDto();

        dto.setId(result.getId());

        // Student Details
        dto.setStudentId(result.getStudent().getId());
        dto.setStudentName(result.getStudent().getFirstName()+" "+result.getStudent().getLastName());
        dto.setRollNumber(result.getStudent().getRollNumber());

        if (result.getStudent().getDepartment() != null) {
            dto.setDepartmentName(
                    result.getStudent()
                            .getDepartment()
                            .getDepartmentName()
            );
        }

        // Exam Details
        dto.setExamId(result.getExam().getId());
        dto.setExamName(result.getExam().getExamName());
        dto.setExamCode(result.getExam().getExamCode());
        dto.setExamDate(result.getExam().getExamDate());
        dto.setStartTime(result.getExam().getStartTime());
        dto.setEndTime(result.getExam().getEndTime());

        // Marks
        dto.setInternalMarks(result.getInternalMarks());
        dto.setExternalMarks(result.getExternalMarks());
        dto.setPracticalMarks(result.getPracticalMarks());
        dto.setTotalMarks(result.getTotalMarks());

        dto.setPercentage(result.getPercentage());
        dto.setGrade(result.getGrade());
        dto.setPass(result.getPass());

        dto.setRemarks(result.getRemarks());
        dto.setPublishedAt(result.getPublishedAt());

        return dto;
    }
}