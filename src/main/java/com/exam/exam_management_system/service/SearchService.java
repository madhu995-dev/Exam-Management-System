package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.SearchResponseDto;

import java.util.List;

public interface SearchService {

    List<SearchResponseDto> searchStudents(String keyword);

    List<SearchResponseDto> searchFaculties(String keyword);

    List<SearchResponseDto> searchDepartments(String keyword);

    List<SearchResponseDto> searchSubjects(String keyword);

    List<SearchResponseDto> searchExams(String keyword);

}