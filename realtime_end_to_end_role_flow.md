# Real-Time End-to-End Execution Trace across Roles
**Project:** Exam Management System (RESTful Backend API)  
**Roles Covered:** `ADMIN`, `FACULTY`, `STUDENT`  

---

## 🗺️ Complete System Examination Lifecycle Map

```
  +------------------------------------------------------------------------------------+
  | PHASE 1: ADMIN (Setup & Configuration)                                             |
  |  [Login] ➔ [Create Dept/Rooms/Seats] ➔ [Schedule Exam] ➔ [Auto-Allocate Seats]    |
  |  ➔ [Generate Bulk Hall Tickets] ➔ [Assign Faculty Invigilators]                    |
  +------------------------------------------------------------------------------------+
                                           |
                                           v
  +------------------------------------------------------------------------------------+
  | PHASE 2: FACULTY (Exam Conduct & Grading)                                          |
  |  [Login] ➔ [View Duty Assignments] ➔ [Record Student Attendance]                   |
  |  ➔ [Input Marks / Excel Bulk Upload]                                               |
  +------------------------------------------------------------------------------------+
                                           |
                                           v
  +------------------------------------------------------------------------------------+
  | PHASE 3: STUDENT (Access & Results)                                                |
  |  [Login] ➔ [View Timetable] ➔ [Download PDF Hall Ticket] ➔ [View Grade Scorecard]   |
  +------------------------------------------------------------------------------------+
```

---

# PHASE 1: ADMIN ROLE (System Setup & Exam Management)

### Step 1.1: Admin Authentication
- **Action:** Admin logs into the system.
- **HTTP Request:** `POST /api/users/login`
- **Request Body:**
  ```json
  {
    "username": "admin",
    "password": "AdminPassword123"
  }
  ```
- **Backend Flow:**
  1. `UserController` receives `LoginRequest`.
  2. `UserServiceImpl` calls `authenticationManager.authenticate(...)`.
  3. `CustomerUserDetailsService` loads `User` from MySQL (`role = ADMIN`).
  4. `JwtService.generateToken()` creates JWT containing `sub: "admin"`.
- **HTTP Response (200 OK):**
  ```json
  {
    "username": "admin",
    "role": "ADMIN",
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJBRE1JTiJ9...",
    "message": "Login Successful"
  }
  ```
- **Security Header for Subsequent Requests:**  
  `Authorization: Bearer eyJhbGciOiJIUzI1...`

---

### Step 1.2: Admin Creates Exam Schedule
- **Action:** Admin schedules an examination.
- **HTTP Request:** `POST /api/exams`
- **Headers:** `Authorization: Bearer <ADMIN_JWT>`
- **Request Body:**
  ```json
  {
    "examName": "Data Structures Mid-Term",
    "subjectId": 101,
    "examDate": "2026-08-15",
    "startTime": "09:30:00",
    "endTime": "12:30:00",
    "totalMarks": 100,
    "passingMarks": 40
  }
  ```
- **Backend Flow:**
  1. `JwtAuthenticationFilter` validates JWT signature and loads GrantedAuthority `"ROLE_ADMIN"`.
  2. `@PreAuthorize("hasRole('ADMIN')")` evaluates to `true`.
  3. `ExamServiceImpl` saves `Exam` entity in MySQL (`id: 50`).
- **HTTP Response (201 Created):**
  ```json
  {
    "id": 50,
    "examName": "Data Structures Mid-Term",
    "subjectName": "Data Structures & Algorithms",
    "examDate": "2026-08-15",
    "status": "SCHEDULED"
  }
  ```

---

### Step 1.3: Admin Triggers Automated Seating Allocation
- **Action:** Admin executes one-click automated seating allocation for Exam ID `50`.
- **HTTP Request:** `POST /api/seat-allocations/allocate/50`
- **Headers:** `Authorization: Bearer <ADMIN_JWT>`
- **Backend Flow (`SeatAllocationServiceImpl.java`):**
  1. Service starts `@Transactional` database transaction.
  2. Queries 45 registered students enrolled in `Subject 101` sorted by Roll Number (`24CS001` to `24CS045`).
  3. Queries available `Seats` sorted by `Room ID`, `Row`, `Column`.
  4. Validates capacity (`Available: 60 >= Required: 45`).
  5. Loops and creates 45 `SeatAllocation` entity rows mapping `(Exam 50, Student X, Seat Y)`.
- **HTTP Response (200 OK):**
  ```json
  [
    {
      "allocationId": 1001,
      "studentRollNumber": "24CS001",
      "studentName": "Rahul Sharma",
      "roomName": "Hall 101",
      "blockName": "Science Block",
      "rowNumber": 1,
      "columnNumber": 1
    },
    ... // 44 more allocations
  ]
  ```

---

### Step 1.4: Admin Generates Bulk Hall Tickets
- **Action:** Admin generates official digital Hall Tickets for all allocated students.
- **HTTP Request:** `POST /api/hall-tickets/generate-bulk/50`
- **Headers:** `Authorization: Bearer <ADMIN_JWT>`
- **Backend Flow:**
  1. `HallTicketServiceImpl` fetches all 45 `SeatAllocation` records.
  2. Generates unique hall ticket numbers (`HT-A1B2C3D4`).
  3. Persists `HallTicket` entities linking `Student`, `Exam`, and `SeatAllocation`.
- **HTTP Response (200 OK):** `Generated 45 Hall Tickets successfully.`

---

### Step 1.5: Admin Assigns Invigilator Faculty
- **Action:** Admin assigns Faculty member to invigilate Hall 101.
- **HTTP Request:** `POST /api/invigilator-assignments`
- **Headers:** `Authorization: Bearer <ADMIN_JWT>`
- **Request Body:**
  ```json
  {
    "facultyId": 12,
    "examId": 50,
    "roomId": 5
  }
  ```
- **Backend Flow:** Verifies faculty availability (no double duty during `09:30-12:30`) and creates `InvigilatorAssignment` entity.

---

# PHASE 2: FACULTY ROLE (Exam Conduct & Marks Entry)

### Step 2.1: Faculty Authentication
- **Action:** Faculty member logs into portal.
- **HTTP Request:** `POST /api/users/login` (`username: "FAC101"`, `password: "Faculty@123"`)
- **HTTP Response (200 OK):** Receives JWT with payload `role: "FACULTY"`.

---

### Step 2.2: Faculty Views Assigned Duties
- **Action:** Faculty views assigned invigilation schedule for today.
- **HTTP Request:** `GET /api/invigilator-assignments/my-assignments`
- **Headers:** `Authorization: Bearer <FACULTY_JWT>`
- **Backend Flow:**
  1. `SecurityContextHolder` fetches logged-in username (`"FAC101"`).
  2. `InvigilatorAssignmentServiceImpl` queries assignments for `Faculty FAC101`.
- **HTTP Response (200 OK):** Returns assigned room `Hall 101` for `Exam 50`.

---

### Step 2.3: Faculty Records Student Attendance
- **Action:** Faculty marks attendance during exam conduct.
- **HTTP Request:** `POST /api/attendances/mark-bulk`
- **Headers:** `Authorization: Bearer <FACULTY_JWT>`
- **Request Body:**
  ```json
  {
    "examId": 50,
    "attendanceList": [
      { "studentId": 1, "status": "PRESENT" },
      { "studentId": 2, "status": "PRESENT" },
      { "studentId": 3, "status": "ABSENT" }
    ]
  }
  ```
- **Backend Flow:** Saves `Attendance` records with `status` enum (`PRESENT` / `ABSENT`).

---

### Step 2.4: Faculty Uploads Marks via Excel Bulk Import
- **Action:** Faculty uploads valuation sheet spreadsheet (`CS101_Marks.xlsx`).
- **HTTP Request:** `POST /api/results/bulk-import/50` (Multipart File Upload)
- **Headers:** `Authorization: Bearer <FACULTY_JWT>`
- **Backend Flow:**
  1. `Apache POI` opens `.xlsx` input stream.
  2. Iterates rows: Row 1 ➔ `Roll: 24CS001, Marks: 85`.
  3. Calculates Grade (`A+`), Pass/Fail status.
  4. Saves `Result` entities in MySQL DB.
- **HTTP Response (200 OK):** `Imported 44 Student Results successfully. 1 Absent.`

---

# PHASE 3: STUDENT ROLE (Access & Grade Viewing)

### Step 3.1: Student Authentication
- **Action:** Student logs into student portal.
- **HTTP Request:** `POST /api/users/login` (`username: "24CS001"`, `password: "Student@123"`)
- **HTTP Response (200 OK):** Receives JWT with payload `role: "STUDENT"`.

---

### Step 3.2: Student Downloads PDF Hall Ticket
- **Action:** Student clicks "Download Hall Ticket".
- **HTTP Request:** `GET /api/hall-tickets/download/HT-A1B2C3D4`
- **Headers:** `Authorization: Bearer <STUDENT_JWT>`
- **Backend Flow:**
  1. `HallTicketServiceImpl` fetches `HallTicket` entity for `HT-A1B2C3D4`.
  2. `OpenPDF` generates an in-memory PDF document stream.
  3. Writes headers: `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="HallTicket_24CS001.pdf"`.
- **HTTP Response (200 OK):** Dynamic Binary PDF Stream downloaded by browser.

---

### Step 3.3: Student Views Exam Result & Scorecard
- **Action:** Student checks final examination grade.
- **HTTP Request:** `GET /api/results/my-results`
- **Headers:** `Authorization: Bearer <STUDENT_JWT>`
- **Backend Flow:**
  1. Service fetches student ID from `SecurityContextHolder`.
  2. Queries `ResultRepository.findByStudentId(...)`.
- **HTTP Response (200 OK):**
  ```json
  [
    {
      "subjectCode": "CS101",
      "subjectName": "Data Structures & Algorithms",
      "marksObtained": 85,
      "totalMarks": 100,
      "grade": "A+",
      "status": "PASS"
    }
  ]
  ```

---

# 4. Summary Matrix of Endpoints & Permissions Across Roles

| API Endpoint | HTTP Method | Allowed Roles | Backend Function |
| :--- | :---: | :---: | :--- |
| `/api/users/login` | `POST` | `permitAll()` | Authenticates credentials & issues JWT token |
| `/api/exams` | `POST` | `ROLE_ADMIN` | Creates new exam schedule |
| `/api/seat-allocations/allocate/{id}` | `POST` | `ROLE_ADMIN` | Runs transactional seating algorithm |
| `/api/hall-tickets/generate-bulk/{id}`| `POST` | `ROLE_ADMIN` | Generates hall ticket records for all students |
| `/api/invigilator-assignments` | `POST` | `ROLE_ADMIN` | Assigns faculty invigilation shift |
| `/api/attendances/mark-bulk` | `POST` | `ROLE_FACULTY` | Marks student attendance during exam |
| `/api/results/bulk-import/{examId}`| `POST` | `ROLE_FACULTY` | Apache POI Excel import of student marks |
| `/api/hall-tickets/download/{id}` | `GET` | `ROLE_STUDENT` | Streams OpenPDF Hall Ticket document |
| `/api/results/my-results` | `GET` | `ROLE_STUDENT` | Returns student scorecard & grade |

