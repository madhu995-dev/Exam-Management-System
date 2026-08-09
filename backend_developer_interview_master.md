# Java Backend Developer — Master Interview Guide
**Project:** Exam Management System (RESTful Backend API)  
**Role:** Java Backend Developer / Spring Boot Engineer  
**Core Stack:** Java 21, Spring Boot 3.5.4, Spring Security 6, JJWT 0.12.6, Spring Data JPA, Hibernate, MySQL, Apache POI, OpenPDF, Lombok, Swagger/OpenAPI  

---

# 1. The Backend Developer Elevator Pitch (30 Seconds)

> **"I am a Java Backend Developer specializing in building RESTful microservices and enterprise applications with Spring Boot. In my Exam Management System project, I designed and developed the entire backend architecture using Java 21, Spring Boot 3.5.4, Spring Data JPA, and MySQL.**  
> **I implemented stateless security with Spring Security 6 and JWT, built dynamic business algorithms for seating allocation and result processing, and integrated server-side document generation using Apache POI for Excel bulk data and OpenPDF for Hall Tickets."**

---

# 2. Complete Backend Architecture & Layered Package Structure

When interviewers ask: *"How did you structure your Spring Boot backend project?"*

```
com.exam.exam_management_system
 ├── 📁 config        -> SecurityConfig, SwaggerConfig, ModelMapperConfig
 ├── 📁 controller    -> REST Controllers (@RestController, @PreAuthorize, DTO mapping)
 ├── 📁 dto           -> Data Transfer Objects (Request/Response contracts, @Valid)
 ├── 📁 entity        -> JPA Entities (@Entity, @Table, Relational Mappings, Enums)
 ├── 📁 enums         -> System Enums (Role, SeatStatus, ExamSession)
 ├── 📁 exception     -> GlobalExceptionHandler (@RestControllerAdvice, ResourceNotFoundException)
 ├── 📁 mapper        -> ModelMapper / Custom Entity-DTO Mappers
 ├── 📁 repository    -> Spring Data JPA Repositories (JpaRepository, Custom JPQL queries)
 ├── 📁 security      -> JwtAuthenticationFilter, CustomerUserDetails
 └── 📁 service       -> Service Interfaces & Implementation Classes (@Service, @Transactional)
```

---

# 3. Key Backend Technical Responsibilities to Highlight

1. **REST API Design & OpenAPI Documentation**: Designed clean, versioned REST endpoints (`/api/users`, `/api/exams`, `/api/hall-tickets`) adhering to standard HTTP methods (GET, POST, PUT, DELETE) and status codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found).
2. **Stateless JWT Security Architecture**: Configured Spring Security 6 `SecurityFilterChain` bean using modern Lambda DSL, built custom `OncePerRequestFilter` for Bearer token validation, and applied SpEL `@PreAuthorize` method security.
3. **Database Schema Design & JPA Mappings**: Modeled a relational MySQL database with 15+ tables using JPA/Hibernate annotations (`@OneToMany`, `@ManyToOne`, `@JoinColumn`, `@PrePersist`, `@PreUpdate`).
4. **Transaction Management & Data Integrity**: Used `@Transactional` on service methods to guarantee ACID properties, prevent partial database commits, and handle foreign key dependencies cleanly.
5. **Algorithmic Business Logic**: Implemented deterministic seating allocation algorithms (`SeatAllocationServiceImpl`) ensuring room capacity limits and zero seating conflicts.
6. **Server-Side File Processing Engines**:
   - **Apache POI**: Parsing bulk Excel `.xlsx` spreadsheets for student marks import.
   - **OpenPDF**: Generating server-side PDF byte streams for Hall Tickets and scorecards.

---

# 4. Deep-Dive Backend Code Walkthroughs

### Module A: Spring Security 6 & Custom JWT Filter Pipeline

```java
// 1. SecurityConfig.java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Stateless JWT REST API
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/users/register", "/api/users/login",
                    "/api/users/forgot-password", "/api/users/verify-otp", "/api/users/reset-password",
                    "/swagger-ui/**", "/v3/api-docs/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

```java
// 2. JwtAuthenticationFilter.java (Extends OncePerRequestFilter)
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final CustomerUserDetailsService customerUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        final String username = jwtService.extractUsername(jwt);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = customerUserDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Store in ThreadLocal SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

---

### Module B: Transactional Seating Allocation Engine (`SeatAllocationServiceImpl.java`)

```java
@Service
@RequiredArgsConstructor
@Transactional
public class SeatAllocationServiceImpl implements SeatAllocationService {

    private final SeatAllocationRepository seatAllocationRepository;
    private final ExamRepository examRepository;
    private final StudentSubjectRepository studentSubjectRepository;
    private final SeatRepository seatRepository;
    private final SeatAllocationMapper seatAllocationMapper;

    @Override
    public List<SeatAllocationResponseDto> allocateSeats(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id : " + examId));

        // 1. Prevent duplicate allocation
        if (!seatAllocationRepository.findByExamId(examId).isEmpty()) {
            throw new IllegalStateException("Seats already allocated for this exam.");
        }

        // 2. Fetch registered students sorted by Roll Number
        List<Student> students = studentSubjectRepository.findBySubjectId(exam.getSubject().getId())
                .stream().map(StudentSubject::getStudent)
                .sorted(Comparator.comparing(Student::getRollNumber))
                .collect(Collectors.toList());

        // 3. Fetch available seats ordered by Room, Row, and Column
        List<Seat> seats = seatRepository.findAll().stream()
                .filter(seat -> seat.getStatus() == SeatStatus.AVAILABLE)
                .sorted(Comparator.comparing((Seat s) -> s.getRoom().getId())
                        .thenComparing(Seat::getRowNumber)
                        .thenComparing(Seat::getColumnNumber))
                .collect(Collectors.toList());

        if (seats.size() < students.size()) {
            throw new IllegalStateException("Insufficient seats available! Required: " + students.size());
        }

        // 4. Sequential Seat Assignment in a single @Transactional boundary
        List<SeatAllocationResponseDto> response = new ArrayList<>();
        for (int i = 0; i < students.size(); i++) {
            SeatAllocation allocation = new SeatAllocation();
            allocation.setExam(exam);
            allocation.setStudent(students.get(i));
            allocation.setSeat(seats.get(i));

            SeatAllocation saved = seatAllocationRepository.save(allocation);
            response.add(seatAllocationMapper.toResponseDto(saved));
        }

        return response;
    }
}
```

---

### Module C: Centralized Global Exception Handling (`GlobalExceptionHandler.java`)

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorDetails> handleResourceNotFound(ResourceNotFoundException ex, WebRequest request) {
        ErrorDetails details = new ErrorDetails(LocalDateTime.now(), ex.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(details, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorDetails> handleIllegalState(IllegalStateException ex, WebRequest request) {
        ErrorDetails details = new ErrorDetails(LocalDateTime.now(), ex.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleGlobalException(Exception ex, WebRequest request) {
        ErrorDetails details = new ErrorDetails(LocalDateTime.now(), ex.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(details, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

---

# 5. Pure Java & Backend Interview Questions (With Concrete Answers)

### Q1: What design patterns did you use in your Spring Boot backend?
> **Answer:**  
> *"1. **Repository Pattern**: Spring Data JPA repositories isolate data access logic from business services.  
> 2. **Dependency Injection & Inversion of Control (IoC)**: Managed by Spring container via constructor injection.  
> 3. **DTO (Data Transfer Object) Pattern**: Separates database entity objects from REST API contracts.  
> 4. **Builder Pattern**: Provided by Lombok `@Builder` on entities and DTOs for clean object construction.  
> 5. **Filter Chain Pattern**: Spring Security's `SecurityFilterChain` processes HTTP request security sequentially."*

---

### Q2: How does `@Transactional` work under the hood in Spring Boot?
> **Answer:**  
> *"Spring creates a dynamic AOP (Aspect-Oriented Programming) proxy around the `@Transactional` annotated bean. When a method starts, the proxy opens a database transaction via `PlatformTransactionManager`. If the method completes normally, the proxy issues a `commit()`. If an unhandled `RuntimeException` is thrown, the proxy automatically calls `rollback()`, ensuring database ACID compliance."*

---

### Q3: What is the difference between `@Component`, `@Service`, and `@Repository`?
> **Answer:**  
> *"All three are stereotype annotations that register Spring beans in the ApplicationContext:  
> - `@Component`: Generic stereotype for any Spring-managed component.  
> - `@Service`: Specialization for business logic classes.  
> - `@Repository`: Specialization for persistence layer components; automatically translates SQL exceptions into Spring's `DataAccessException` hierarchy."*

---

### Q4: How do you handle LazyInitializationException in Spring Data JPA?
> **Answer:**  
> *"By default, `@OneToMany` relationships are loaded lazily (`FetchType.LAZY`). A `LazyInitializationException` occurs if code accesses an uninitialized lazy collection after the Hibernate session has closed. I solved this by:  
> 1. Using `@EntityGraph` or custom JPQL `FETCH JOIN` queries in `JpaRepository`.  
> 2. Keeping transaction boundaries open using `@Transactional` at the service layer so lazy collections initialize within an active session."*

---

### Q5: Why constructor injection over `@Autowired` on field variables?
> **Answer:**  
> *"1. **Immutability**: Fields can be declared `final`.  
> 2. **Testability**: Dependencies can be easily mocked in unit tests (JUnit 5 / Mockito) without spinning up Spring context.  
> 3. **Prevents Circular Dependencies**: Spring detects circular dependencies at compile/startup time rather than runtime."*

---

### Q6: How do you optimize database performance for 100,000+ students?
> **Answer:**  
> *"1. **Indexing**: Add B-Tree composite indexes on `username`, `roll_number`, `exam_id`, and `student_id`.  
> 2. **Pagination**: Return `Page<T>` using `Pageable` in `JpaRepository` to prevent out-of-memory errors.  
> 3. **Batch Fetching**: Configure `hibernate.jdbc.batch_size=30` for bulk inserts/updates.  
> 4. **DTO Projection**: Fetch only required fields via JPQL interface projections instead of loading full entity graphs."*

---

# 6. Backend Developer Quick Interview Reference

| Feature | Primary Backend Classes Involved |
| :--- | :--- |
| **Authentication & Token** | `SecurityConfig`, `JwtAuthenticationFilter`, `CustomerUserDetailsService`, `JwtService`, `UserServiceImpl` |
| **RBAC Authorization** | `CustomerUserDetails` (`ROLE_*`), `Role` Enum, `@PreAuthorize` in `ExamController` |
| **Seating Engine** | `SeatAllocationServiceImpl` (`@Transactional`), `SeatRepository`, `StudentSubjectRepository` |
| **OTP Password Reset** | `UserServiceImpl` (`forgotPassword`, `resetPassword`), `EmailServiceImpl` (`JavaMailSender`) |
| **Hall Ticket Generation** | `HallTicketServiceImpl`, `HallTicketRepository`, OpenPDF Document Writer |
| **Global Exceptions** | `GlobalExceptionHandler` (`@RestControllerAdvice`), `ResourceNotFoundException` |
