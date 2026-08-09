# 🏗️ Exam Management System - System Architecture & Design Document

## 1. Executive Summary

The **Exam Management System (EMS)** is an enterprise-grade university examination portal built with a **Spring Boot REST Backend** and a modern **React.js Single Page Application (SPA)** frontend using Vanilla CSS for dark glassmorphic UI aesthetics.

The system automates the complete university examination lifecycle:
- User & Role Management (Admin, Faculty, Student)
- Academic Department & Course Cataloging
- Building Block, Exam Hall & Seat Capacity Management
- Examination Series & Timetable Scheduling
- Algorithmic Automated Seat Allocation Engine
- Official Hall Ticket / Admit Card Generation with Print Support
- Candidate Examination Session Attendance Register
- Internal, External & Practical Marks Processing & Grade Calculation
- Smart CSV Bulk Data Import Engine for Batch Registrations

---

## 2. Technology Stack & Design System

### Backend Architecture
- **Framework**: Spring Boot 3.x (Java 17)
- **Security**: Spring Security 6, JWT (JSON Web Tokens), BCrypt Password Hashing
- **Data Access**: Spring Data JPA, Hibernate ORM
- **Database**: MySQL Relational Database
- **Mapping & Utilities**: ModelMapper, Lombok, Jakarta Validation
- **Documentation**: OpenAPI / Swagger v3

### Frontend Architecture
- **Core Engine**: React.js 18 (Functional Components, React Hooks)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with Bearer Interceptor & Relative Base URL Proxying
- **State Management**: React Context API (`AuthContext`)
- **Styling**: Pure Vanilla CSS (CSS Custom Properties, Glassmorphism, Dark Palette)
- **Icons**: Lucide React

---

## 3. Spring Boot Backend Directory Structure

```
d:/springboot/exam-management-system/src/main/java/com/exam/exam_management_system/
├── config/
│   ├── SecurityConfig.java         # Spring Security 6 FilterChain, CORS & Stateless JWT Config
│   └── ApplicationConfig.java      # ModelMapper & PasswordEncoder Bean Definitions
├── controller/                     # REST API Controllers with Role Guards (@PreAuthorize)
│   ├── AuthController.java         # Authentication & Registration APIs
│   ├── StudentController.java      # Student CRUD & Pagination APIs
│   ├── FacultyController.java      # Faculty Management APIs
│   ├── DepartmentController.java   # Academic Department APIs
│   ├── SubjectController.java      # Course / Subject APIs
│   ├── BlockController.java        # Building Block APIs
│   ├── RoomController.java         # Exam Hall Room APIs
│   ├── ExamSeriesController.java   # Examination Series APIs
│   ├── ExamController.java         # Scheduled Exam APIs
│   ├── StudentSubjectController.java # Student Subject Registration APIs
│   ├── SeatAllocationController.java # Automated Seat Allocation APIs
│   ├── InvigilatorAssignmentController.java # Invigilation Supervision APIs
│   ├── HallTicketController.java   # Admit Card Generator APIs
│   ├── AttendanceController.java   # Attendance Marking APIs
│   ├── ResultController.java       # Results & Grade Publishing APIs
│   ├── DashboardController.java    # Portal Metrics APIs
│   └── ReportController.java       # Analytical Reports APIs
├── dto/                            # Data Transfer Objects
│   ├── StudentDTO.java
│   ├── FacultyRequestDto.java & FacultyResponseDto.java
│   ├── ExamRequestDto.java & ExamResponseDto.java
│   ├── SeatAllocationResponseDto.java
│   ├── HallTicketResponseDto.java
│   └── ResultRequestDto.java & ResultResponseDto.java
├── entity/                         # JPA Relational Entities
│   ├── User.java                   # Login Accounts (username, password, role, email)
│   ├── Role.java                   # Role Enum: ADMIN, FACULTY, STUDENT
│   ├── Student.java                # Student Details (rollNumber, email, phone, department)
│   ├── Faculty.java                # Faculty Details (employeeId, designation, department)
│   ├── Department.java             # Academic Department (departmentName, departmentCode)
│   ├── Subject.java                # Subject / Course (subjectName, subjectCode)
│   ├── Block.java & Room.java      # Exam Building & Hall (roomNumber, capacity)
│   ├── Seat.java                   # Individual Seat (rowNumber, columnNumber, status)
│   ├── ExaminationSeries.java      # Series (seriesName, academicYear, semester)
│   ├── Exam.java                   # Scheduled Exam (examCode, examDate, startTime, duration)
│   ├── StudentSubject.java         # Student Subject Registration Mapping
│   ├── SeatAllocation.java         # Seat Allocation Mapping (exam, student, seat)
│   ├── InvigilatorAssignment.java  # Supervision Assignment Mapping (exam, faculty, room)
│   ├── HallTicket.java             # Admit Card (hallTicketNumber)
│   ├── Attendance.java             # Session Attendance (PRESENT, ABSENT, MALPRACTICE)
│   └── Result.java                 # Exam Result (internal, external, total, percentage, grade)
├── exception/                      # Global Custom Exception Handlers
│   ├── GlobalExceptionHandler.java # Centralized JSON Error Handler (@RestControllerAdvice)
│   ├── StudentNotFoundException.java
│   ├── DepartmentNotFoundException.java
│   └── ResourceNotFoundException.java
├── repository/                     # Spring Data JPA Repository Interfaces
│   ├── UserRepository.java
│   ├── StudentRepository.java
│   ├── FacultyRepository.java
│   ├── ExamRepository.java
│   ├── SeatAllocationRepository.java
│   ├── HallTicketRepository.java
│   ├── AttendanceRepository.java
│   └── ResultRepository.java
├── security/                       # Security & JWT Token Processing
│   ├── JwtAuthenticationFilter.java# Requests JWT Bearer Validation Filter
│   ├── JwtService.java             # Token Generation & Claims Parser
│   └── CustomerUserDetailsService.java # UserDetails Loader with Auto-Sync Engine
└── service/ & service/impl/        # Core Business Logic Layer
    ├── UserServiceImpl.java        # Authentication, Password Recovery & Auto-Sync Engine
    ├── StudentServiceImpl.java     # Student Operations & Entity Mappings
    ├── FacultyServiceImpl.java     # Faculty Operations & User Account Generation
    ├── SeatAllocationServiceImpl.java # Algorithmic Seating Allocation Engine
    ├── HallTicketServiceImpl.java  # Hall Ticket Generator
    ├── ResultServiceImpl.java      # Automatic Mark Evaluator & Grade Calculator
    └── AttendanceServiceImpl.java  # Attendance Register Logic
```

---

## 4. React.js Frontend Directory Structure

```
d:/springboot/exam-management-system/frontend/src/
├── api/                            # Axios Service Layer Modules
│   ├── axiosConfig.js              # Axios Instance with JWT Interceptor (HTTP 401 guard)
│   ├── authApi.js                  # Login, Register, Forgot Password
│   ├── studentApi.js               # Student CRUD & Sorting APIs
│   ├── facultyApi.js               # Faculty Management APIs
│   ├── examApi.js                  # Exam Schedule APIs
│   ├── seatAllocationApi.js        # Seat Allocation Engine APIs
│   ├── hallTicketApi.js            # Hall Ticket Generation APIs
│   ├── attendanceApi.js            # Attendance Register APIs
│   └── resultApi.js                # Result Publishing APIs
├── components/                     # Component Library
│   ├── common/
│   │   ├── Navbar.jsx              # Header Navigation with User Avatar & Logout
│   │   ├── Sidebar.jsx             # Role-Aware Navigation Menu
│   │   ├── LoadingSpinner.jsx      # Animated Loading Spinner Component
│   │   ├── ErrorMessage.jsx        # Standard Error Display Banner with Retry
│   │   ├── EmptyState.jsx          # Custom Empty Data View
│   │   ├── SearchInput.jsx         # Live Search Bar
│   │   ├── Pagination.jsx          # Data Table Page Switcher
│   │   └── BulkUploadModal.jsx     # Smart CSV Parser with Header Normalization
│   └── layout/
│       ├── AdminLayout.jsx         # App Shell Layout (Sidebar + Navbar + Content Outlet)
│       └── ProtectedRoute.jsx      # Role Guard Component
├── context/
│   └── AuthContext.jsx             # Global State (Token, Current User, Role, Logout)
├── pages/                          # Application Pages
│   ├── auth/
│   │   ├── LoginPage.jsx           # Glassmorphic Login Screen
│   │   ├── RegisterPage.jsx        # Account Creation Screen with Role Selection
│   │   ├── ForgotPasswordPage.jsx  # Recovery Request
│   │   ├── VerifyOtpPage.jsx       # 6-Digit OTP Verification
│   │   └── ResetPasswordPage.jsx   # Password Reset
│   ├── dashboard/
│   │   ├── AdminDashboardPage.jsx  # Admin Metrics & Quick Shortcuts
│   │   ├── FacultyDashboardPage.jsx# Faculty Supervision Overview
│   │   └── StudentDashboardPage.jsx# Student Quick Shortcuts (Admit Cards, Results)
│   ├── student/
│   │   └── StudentListPage.jsx     # Student Directory + Registration Modal + Bulk Upload
│   ├── faculty/
│   │   └── FacultyListPage.jsx     # Faculty Directory + Add Faculty + Bulk Upload
│   ├── exam/
│   │   └── ExamListPage.jsx        # Examination Schedule Table + Bulk Upload
│   ├── seatallocation/
│   │   └── SeatAllocationPage.jsx  # Algorithmic Seating Matrix Generator
│   ├── hallticket/
│   │   └── HallTicketPage.jsx      # Admit Card Generation & Print View Modal
│   ├── attendance/
│   │   └── AttendancePage.jsx      # Session Attendance Register
│   ├── result/
│   │   └── ResultPage.jsx          # Results & Marks Portal + Bulk Upload
│   └── bulk/
│       └── BulkImportPage.jsx      # Central Bulk Import Hub for Batch CSV Uploads
├── styles/
│   └── index.css                   # Custom CSS Design System Tokens & Glassmorphic Utilities
└── App.jsx                         # Main Routing Configuration
```

---

## 5. Security & Access Control Matrix

| Feature / Page | Endpoint Path | `ADMIN` | `FACULTY` | `STUDENT` |
| :--- | :--- | :---: | :---: | :---: |
| **Authentication & Registration** | `/api/auth/login`, `/api/users/register` | ✅ | ✅ | ✅ |
| **Admin Dashboard** | `/admin/dashboard` | ✅ | ❌ | ❌ |
| **Faculty Dashboard** | `/faculty/dashboard` | ❌ | ✅ | ❌ |
| **Student Dashboard** | `/student/dashboard` | ❌ | ❌ | ✅ |
| **Department Management** | `/api/departments` | ✅ | ❌ | ❌ |
| **Faculty Directory** | `/api/faculties` | ✅ | ❌ | ❌ |
| **Student Directory** | `/api/students` | ✅ | Read Only | ❌ |
| **Exam Scheduling** | `/api/exams` | ✅ | Read Only | Read Only |
| **Seat Allocation Engine** | `/api/seat-allocations` | ✅ | Read Only | Read Only |
| **Hall Ticket Admit Cards** | `/api/hall-tickets` | ✅ | Read Only | Read Only |
| **Attendance Register** | `/api/attendance` | ✅ | ✅ | Read Only |
| **Results & Marks Portal** | `/api/results` | ✅ | Read Only | Read Only |
| **Bulk Data Imports** | `/bulk-import` | ✅ | ❌ | ❌ |

---

## 6. System Workflows

### 6.1 Algorithmic Seat Allocation Workflow
```
[Select Scheduled Exam] ➔ [Fetch Enrolled Students] ➔ [Fetch Available Seats in Rooms]
                                                              │
                                                              ▼
[Save Seat Allocations] ◄── [Map Student Roll Number to Seat] ┘
```

### 6.2 Admit Card Generation & Printing Workflow
```
[Seat Allocation Confirmed] ➔ [Generate Unique Hall Ticket Number]
                                           │
                                           ▼
[Print Admit Card Modal] ◄── [Populate Student, Exam, Block, Room & Seat]
```

### 6.3 Smart CSV Import Normalizer Workflow
```
[User Uploads CSV] ➔ [Smart Header Normalizer] ➔ [Map 'Roll No' to 'hallTicketNumber']
                                                              │
                                                              ▼
[Auto-Create Login Account] ◄── [Validate Payload & Save Entity] ┘
```

---

## 7. Credential Reference

| Role | Username Format | Default Password |
| :--- | :--- | :--- |
| **`ADMIN`** | Custom Username (e.g., `admin`) | Custom Password (e.g., `admin123`) |
| **`FACULTY`** | Faculty Employee ID (e.g., `EMP001`, `FAC001`) | **`Faculty@123`** |
| **`STUDENT`** | Student Roll Number (e.g., `HT20261001`, `HT2026101`) | **`Student@123`** |
