package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.StudentDTO;
import com.exam.exam_management_system.entity.Department;
import com.exam.exam_management_system.entity.Student;
import com.exam.exam_management_system.entity.User;
import com.exam.exam_management_system.exception.DepartmentNotFoundException;
import com.exam.exam_management_system.exception.StudentNotFoundException;
import com.exam.exam_management_system.repository.DepartmentRepository;
import com.exam.exam_management_system.repository.StudentRepository;
import com.exam.exam_management_system.repository.UserRepository;
import com.exam.exam_management_system.service.StudentService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.exam.exam_management_system.entity.Role;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final ModelMapper modelMapper;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public StudentServiceImpl(StudentRepository studentRepository, ModelMapper modelMapper, DepartmentRepository departmentRepository, UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.studentRepository=studentRepository;
        this.modelMapper=modelMapper;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public StudentDTO addStudent(StudentDTO studentDTO) {
        Student student=modelMapper.map(studentDTO, Student.class);
        Department department=departmentRepository.findById(studentDTO.getDepartmentId())
                .orElseThrow(()->
                        new DepartmentNotFoundException("Department Not Found with id : "+studentDTO.getDepartmentId()));
        student.setDepartment(department);

        // Populate required non-null entity fields that are not in StudentDTO
        if (student.getRollNumber() == null || student.getRollNumber().trim().isEmpty()) {
            student.setRollNumber(studentDTO.getHallTicketNumber());
        }
        if (student.getPhoneNumber() == null || student.getPhoneNumber().trim().isEmpty()) {
            student.setPhoneNumber(studentDTO.getPhone() != null ? studentDTO.getPhone() : "9876543210");
        }
        if (student.getSemester() == null) {
            student.setSemester(1);
        }
        if (student.getSection() == null || student.getSection().trim().isEmpty()) {
            student.setSection("A");
        }
        if (student.getAdmissionDate() == null) {
            student.setAdmissionDate(LocalDate.now());
        }

        Student savedStudent=studentRepository.save(student);

        // Check if user already exists
        if (!userRepository.existsByUsername(savedStudent.getRollNumber())) {
            User user = User.builder()
                    .username(savedStudent.getRollNumber())
                    .email(savedStudent.getEmail())
                    .password(passwordEncoder.encode("Student@123"))
                    .role(Role.STUDENT)
                    .enabled(true)
                    .build();

            userRepository.save(user);
        }

        StudentDTO response= modelMapper.map(savedStudent, StudentDTO.class);
        response.setDepartmentId(savedStudent.getDepartment().getId());
        response.setPhone(savedStudent.getPhoneNumber());
        return response;
    }

    @Override
    public List<StudentDTO> getAllStudents(){
        List<Student> students=studentRepository.findAll();
        return students.stream()
                .map(student -> {
                    StudentDTO dto=modelMapper.map(student, StudentDTO.class);
                    dto.setDepartmentId(student.getDepartment().getId());
                    dto.setPhone(student.getPhoneNumber());
                    return dto;
                })
                .toList();
    }

    @Override
    public StudentDTO getStudentById(Long id){
        Student student=studentRepository.findById(id)
                .orElseThrow(()->
                        new StudentNotFoundException("Student not Found with id : "+id));
        StudentDTO response=modelMapper.map(student, StudentDTO.class);
        response.setDepartmentId(student.getDepartment().getId());
        response.setPhone(student.getPhoneNumber());
        return response;
    }

    @Override
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {

        // Step 1: Find the existing student
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() ->
                        new StudentNotFoundException("Student not found with id : " + id));

        // Step 2: Find the department
        Department department = departmentRepository.findById(studentDTO.getDepartmentId())
                .orElseThrow(() ->
                        new DepartmentNotFoundException(
                                "Department not found with id : " + studentDTO.getDepartmentId()));

        // Step 3: Update fields
        existingStudent.setDepartment(department);
        existingStudent.setFirstName(studentDTO.getFirstName());
        existingStudent.setLastName(studentDTO.getLastName());
        existingStudent.setEmail(studentDTO.getEmail());
        existingStudent.setPhoneNumber(studentDTO.getPhone());
        existingStudent.setGender(studentDTO.getGender());
        existingStudent.setDateOfBirth(studentDTO.getDateOfBirth());
        existingStudent.setHallTicketNumber(studentDTO.getHallTicketNumber());

        // Step 4: Save
        Student updatedStudent = studentRepository.save(existingStudent);

        // Step 5: Convert Entity → DTO
        StudentDTO response = modelMapper.map(updatedStudent, StudentDTO.class);
        response.setDepartmentId(updatedStudent.getDepartment().getId());
        response.setPhone(updatedStudent.getPhoneNumber());

        return response;
    }

    @Override
    public void deleteStudent(Long id){
        studentRepository.findById(id)
                .orElseThrow(()->
                        new StudentNotFoundException("Student not found with id : "+id));
        studentRepository.deleteById(id);
    }

    @Override
    public List<StudentDTO> getStudentByDepartmentId(Long DepartmentId) {
        List<Student> students=studentRepository.findByDepartmentId(DepartmentId);
        return students.stream()
                .map(student -> {
                    StudentDTO dto=modelMapper.map(student, StudentDTO.class);
                    dto.setDepartmentId(student.getDepartment().getId());
                    dto.setPhone(student.getPhoneNumber());
                    return dto;
                })
                .toList();
    }

    @Override
    public StudentDTO getStudentByhallTicketNumber(String hallTicketNumber) {
        Student student = studentRepository.findByHallTicketNumber(hallTicketNumber)
                .orElseThrow(() ->
                        new StudentNotFoundException("Student not found with Hall Ticket Number"));
        StudentDTO response=modelMapper.map(student, StudentDTO.class);
        response.setDepartmentId(student.getDepartment().getId());
        response.setPhone(student.getPhoneNumber());
        return response;
    }

    @Override
    public List<StudentDTO> getStudentByFirstName(String FirstName) {
        List<Student> students=studentRepository.findStudentByFirstName(FirstName);
        return students.stream()
                .map(student -> {
                    StudentDTO dto=modelMapper.map(student, StudentDTO.class);
                    dto.setDepartmentId(student.getDepartment().getId());
                    dto.setPhone(student.getPhoneNumber());
                    return dto;
                })
                .toList();
    }

    @Override
    public Page<StudentDTO> getAllStudentsByPage(int page, int size) {
        Pageable pageable= PageRequest.of(page, size);
        Page<Student> studentPage=studentRepository.findAll(pageable);
        return studentPage.map(student -> {
            StudentDTO dto=modelMapper.map(student, StudentDTO.class);
            dto.setDepartmentId(student.getDepartment().getId());
            dto.setPhone(student.getPhoneNumber());
            return dto;
        });
    }

    @Override
    public List<StudentDTO> getAllStudentsSorted(String field,String direction) {
        Sort sort=direction.equalsIgnoreCase("desc")
                ?Sort.by(field).descending()
                :Sort.by(field).ascending();
        List<Student> students=studentRepository.findAll(sort);
        return students.stream()
                .map(student -> {
                    StudentDTO dto=modelMapper.map(student, StudentDTO.class);
                    dto.setDepartmentId(student.getDepartment().getId());
                    dto.setPhone(student.getPhoneNumber());
                    return dto;
                })
                .toList();
    }
}
