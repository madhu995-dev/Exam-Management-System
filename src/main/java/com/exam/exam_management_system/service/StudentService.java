package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.StudentDTO;
import com.exam.exam_management_system.entity.Student;
import org.springframework.data.domain.Page;

import java.util.List;

public interface StudentService {
    StudentDTO addStudent(StudentDTO studentDTO);
    List<StudentDTO> getAllStudents();
    StudentDTO getStudentById(Long id);
    StudentDTO updateStudent(Long id,StudentDTO studentDTO);
    void deleteStudent(Long id);
    List<StudentDTO> getStudentByDepartmentId(Long DepartmentId);
    StudentDTO getStudentByhallTicketNumber(String hallTIcketNumber);
    List<StudentDTO> getStudentByFirstName(String FirstName);
    Page<StudentDTO> getAllStudentsByPage(int page,int size);
    List<StudentDTO> getAllStudentsSorted(String field,String direction);
}
