# Final Interview Master Checklist — Exam Management System
**Target Role:** Java Backend Developer / Spring Boot Engineer  
**Core Technologies:** Java 21, Spring Boot 3.5.4, Spring Security 6, JJWT 0.12.6, Spring Data JPA, MySQL, Apache POI, OpenPDF, Swagger/OpenAPI  

---

# PART 1: Database Entity & Relational Schema Map (ER Diagram)

When interviewers ask: *"Explain your database design and entity relationships."*

```
                             +--------------------+
                             |     User Entity    |
                             |  (users table)     |
                             +--------------------+
                             | - id (PK)          |
                             | - username (UQ)    |
                             | - password (BCrypt)|
                             | - role (Enum)      |
                             | - email (UQ)       |
                             | - enabled (Boolean)|
                             +--------------------+
                                      |
                 +--------------------+--------------------+
                 | 1:1                                     | 1:1
                 v                                         v
       +--------------------+                    +--------------------+
       |   Student Entity   |                    |   Faculty Entity   |
       |  (students table)  |                    |  (faculties table) |
       +--------------------+                    +--------------------+
       | - id (PK)          |                    | - id (PK)          |
       | - roll_number (UQ) |                    | - employee_id (UQ) |
       | - department_id    |-----> Department   | - department_id    |-----> Department
       +--------------------+                    +--------------------+
                 |                                         |
                 | 1:N                                     | 1:N
                 v                                         v
   +---------------------------+             +---------------------------+
   |  StudentSubject Entity    |             | InvigilatorAssign Entity  |
   | (student_subjects table)  |             | (invigilator_assign table)|
   +---------------------------+             +---------------------------+
   | - id (PK)                 |             | - id (PK)                 |
   | - student_id (FK)         |             | - faculty_id (FK)         |
   | - subject_id (FK)         |             | - exam_id (FK)            |
   +---------------------------+             | - room_id (FK)            |
                 |                           +---------------------------+
                 v
       +--------------------+
       |   Subject Entity   |
       |  (subjects table)  |
       +--------------------+
                 | 1:N
                 v
       +--------------------+        +--------------------+        +--------------------+
       |    Exam Entity     |        |    Block Entity    |        |    Room Entity     |
       |   (exams table)    |        |   (blocks table)   |        |   (rooms table)    |
       +--------------------+        +--------------------+        +--------------------+
                 |                            |                             |
                 | 1:N                        +--------------+--------------+
                 v                                           | 1:N
   +---------------------------+                             v
   |  SeatAllocation Entity    |                   +--------------------+
   | (seat_allocations table)  |                   |    Seat Entity     |
   +---------------------------+                   |   (seats table)    |
   | - id (PK)                 |                   +--------------------+
   | - exam_id (FK)            |                   | - id (PK)          |
   | - student_id (FK)         |                   | - room_id (FK)     |
   | - seat_id (FK)            |<------------------| - row_number       |
   +---------------------------+                   | - column_number    |
            |         |                            | - status (Enum)    |
            | 1:1     | 1:N                        +--------------------+
            v         v
+------------------+ +------------------+ +------------------+
| HallTicket Entity| |Attendance Entity | |  Result Entity   |
| (hall_tickets)   | |(attendances)     | | (results table)  |
+------------------+ +------------------+ +------------------+
```

---

# PART 2: Complete REST API Endpoint Matrix

| Module | HTTP Method | Endpoint URL | Required Permission | Request / Query Params | Primary Backend Logic |
| :--- | :---: | :--- | :---: | :--- | :--- |
| **Auth** | `POST` | `/api/users/register` | `permitAll()` | `User` JSON Body | Encrypts password using BCrypt, saves User entity |
| **Auth** | `POST` | `/api/users/login` | `permitAll()` | `LoginRequest` JSON | Validates credentials via `AuthenticationManager`, issues JWT |
| **Auth** | `POST` | `/api/users/forgot-password` | `permitAll()` | `ForgotPasswordRequestDto` | Generates 6-digit OTP, sets 5-min expiry, sends Email |
| **Auth** | `POST` | `/api/users/verify-otp` | `permitAll()` | `VerifyOtpRequestDto` | Validates OTP code and expiration timestamp |
| **Auth** | `POST` | `/api/users/reset-password` | `permitAll()` | `ResetPasswordRequestDto` | Encrypts new password with BCrypt, clears OTP fields |
| **Auth** | `PUT` | `/api/users/change-password` | `authenticated()`| `ChangePasswordRequest` | Fetches username from `SecurityContextHolder`, updates password |
| **Exams** | `POST` | `/api/exams` | `hasRole('ADMIN')` | `ExamRequestDto` | Validates subject & schedules new examination |
| **Exams** | `GET` | `/api/exams` | `hasAnyRole(...)` | None | Returns list of scheduled exams |
| **Exams** | `PUT` | `/api/exams/{id}` | `hasRole('ADMIN')` | `ExamRequestDto` | Updates exam schedule |
| **Exams** | `DELETE` | `/api/exams/{id}` | `hasRole('ADMIN')` | `{id}` path param | Deletes exam entity |
| **Seating**| `POST` | `/api/seat-allocations/allocate/{id}`| `hasRole('ADMIN')` | `{examId}` path param | Runs deterministic seating algorithm in `@Transactional` method |
| **Tickets**| `POST` | `/api/hall-tickets/generate-bulk/{id}`| `hasRole('ADMIN')` | `{examId}` path param | Generates `HallTicket` entities for all allocated students |
| **Tickets**| `GET` | `/api/hall-tickets/download/{number}`| `hasRole('STUDENT')`| `{hallTicketNumber}`| Generates dynamic binary PDF stream via **OpenPDF** |
| **Duties** | `POST` | `/api/invigilator-assignments`| `hasRole('ADMIN')` | `InvigilatorAssignDto`| Validates faculty availability and assigns invigilation shift |
| **Attend** | `POST` | `/api/attendances/mark-bulk`| `hasRole('FACULTY')`| Attendance List JSON | Records student `PRESENT` / `ABSENT` status during exam |
| **Results**| `POST` | `/api/results/bulk-import/{id}`| `hasRole('FACULTY')`| Multipart `.xlsx` File | Parses spreadsheet via **Apache POI**, auto-calculates grades |
| **Results**| `GET` | `/api/results/my-results` | `hasRole('STUDENT')`| None | Fetches logged-in student's grades from `SecurityContext` |

---

# PART 3: 25 Rapid-Fire Java 21 & Spring Boot Revision Q&As

### Q1: What new Java features are used in Java 21?
> **Answer:** *"Java 21 introduced Virtual Threads (Project Loom), Sequenced Collections (`getFirst()`, `getLast()`), Record Patterns, and Pattern Matching for switch. My application runs on OpenJDK 21 LTS."*

### Q2: What is Spring Boot Autoconfiguration?
> **Answer:** *"Spring Boot automatically configures beans based on classpath dependencies using `@EnableAutoConfiguration` and `@SpringBootApplication`. For example, adding `spring-boot-starter-security` automatically registers the Spring Security filter chain."*

### Q3: What is Spring Inversion of Control (IoC) and Dependency Injection (DI)?
> **Answer:** *"IoC shifts bean lifecycle management from developer code to the Spring Container (`ApplicationContext`). DI is the pattern where dependencies are injected into beans via constructors, fields, or setters rather than using `new` operators."*

### Q4: Difference between `@Component`, `@Service`, `@Repository`, `@Controller`, `@RestController`?
> **Answer:**  
> - `@Component`: Generic Spring-managed bean.  
> - `@Service`: Business logic layer stereotype.  
> - `@Repository`: DAO/Persistence layer stereotype with SQL exception translation.  
> - `@Controller`: Spring MVC web controller returning views.  
> - `@RestController`: Combination of `@Controller` + `@ResponseBody`, returning JSON/XML directly.

### Q5: Difference between `JpaRepository` and `CrudRepository`?
> **Answer:** *"JpaRepository extends `PagingAndSortingRepository` which extends `CrudRepository`. `JpaRepository` adds JPA-specific methods like `flush()`, `saveAndFlush()`, `deleteInBatch()`, and returns `List` instead of `Iterable`."*

### Q6: How does `@Query` work in Spring Data JPA?
> **Answer:** *"It allows writing custom JPQL (Java Persistence Query Language) or native SQL queries directly above repository interface methods, e.g., `@Query("SELECT u FROM User u WHERE u.username = :username")`."*

### Q7: What is Spring Boot Starter?
> **Answer:** *"Starters are pre-packaged sets of dependency descriptors that simplify Maven/Gradle configuration. `spring-boot-starter-web` pulls in Tomcat, Spring MVC, and Jackson JSON."*

### Q8: What is Jackson JSON in Spring Boot?
> **Answer:** *"Jackson is the default HTTP message converter library in Spring Boot that automatically serializes Java objects to JSON responses and deserializes JSON request bodies into Java DTOs."*

### Q9: Difference between `@Value` and `@ConfigurationProperties`?
> **Answer:**  
> - `@Value`: Injects individual property values using SpEL (e.g. `@Value("${jwt.secret}")`).  
> - `@ConfigurationProperties`: Binds entire hierarchical configuration prefixes into structured Java beans.

### Q10: How do you implement CORS in Spring Boot?
> **Answer:** *"Using `@CrossOrigin` on controller classes or registering a global `WebMvcConfigurer` bean with `.addCorsMappings()` specifying allowed origins, methods, and headers."*

---

# PART 4: Final 5-Minute Pre-Interview Checklist

```
  [ ] 1. Walkthrough Script Ready : Can speak the 3-minute presentation smoothly.
  [ ] 2. Core Code Memory         : Remember SecurityConfig, JwtAuthenticationFilter,
                                    SeatAllocationServiceImpl, and GlobalExceptionHandler.
  [ ] 3. Tech Stack Keywords      : Java 21, Spring Boot 3.5.4, Spring Security 6, JJWT 0.12.6,
                                    Spring Data JPA, MySQL, Apache POI, OpenPDF.
  [ ] 4. Ownership Voice          : Speak using "I designed...", "I built...", "I implemented...".
  [ ] 5. Mindset                  : Be confident—you have built a complete enterprise API!
```

