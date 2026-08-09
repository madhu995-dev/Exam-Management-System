package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.FacultyRequestDto;
import com.exam.exam_management_system.dto.FacultyResponseDto;

import java.util.List;

public interface FacultyService {

    FacultyResponseDto createFaculty(FacultyRequestDto facultyRequestDto);

    List<FacultyResponseDto> getAllFaculties();

    FacultyResponseDto getFacultyById(Long id);

    FacultyResponseDto updateFaculty(Long id, FacultyRequestDto facultyRequestDto);

    void deleteFaculty(Long id);

}