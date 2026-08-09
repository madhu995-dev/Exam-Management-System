# Master Interview Guide with Code Examples & Verbal Scripts
**Project:** Exam Management System (Full-Stack College Examination Platform)  
**Tech Stack:** Java 21, Spring Boot 3.5.4, Spring Security 6, JJWT 0.12.6, Spring Data JPA, MySQL, Apache POI, OpenPDF, React, Axios  

---

# SECTION 1: "Tell Me About Your Project" — Complete Script with Code Examples

### 1. Problem & Objective
> **Verbal Pitch for Interviewer:**  
> *"My project is an **Exam Management System** created to solve common operational bottlenecks in colleges—such as manual exam seating creation, room double-booking, paper hall ticket distribution, and delayed result declarations. I built a decoupled full-stack architecture with a **Spring Boot 3 REST API backend**, **Spring Security 6 stateless JWT authentication**, and a **React frontend**."*

---

### 2. Architecture & Code Examples (Show & Explain)

#### A. Security Configuration (`SecurityConfig.java`)
> **What to tell interviewer:**  
> *"In Spring Boot 3, I configured a `SecurityFilterChain` bean using modern Lambda DSL syntax. I disabled CSRF since the API uses stateless JWTs, defined public endpoints for login/registration/OTP reset using `permitAll()`, and added my custom `JwtAuthenticationFilter` before `UsernamePasswordAuthenticationFilter`."*

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables @PreAuthorize at method level
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Stateless JWT API
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/users/register",
                    "/api/users/login",
                    "/api/users/forgot-password",
                    "/api/users/verify-otp",
                    "/api/users/reset-password",
                    "/swagger-ui/**",
                    "/v3/api-docs/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // One-way salted password hashing
    }
}
```

---

#### B. Custom JWT Interceptor Filter (`JwtAuthenticationFilter.java`)
> **What to tell interviewer:**  
> *"My filter extends `OncePerRequestFilter` to ensure single execution per HTTP request. It checks for the `Authorization: Bearer <token>` header, parses the username using `JwtService`, fetches `UserDetails` from MySQL via `CustomerUserDetailsService`, and sets a `UsernamePasswordAuthenticationToken` in `SecurityContextHolder`."*

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

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
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

---

#### C. Role-Based Access Control (`CustomerUserDetails.java` & `ExamController.java`)
> **What to tell interviewer:**  
> *"I mapped user roles (`ADMIN`, `FACULTY`, `STUDENT`) to Spring Security `GrantedAuthority` with a mandatory `"ROLE_"` prefix. In REST controllers, I enforced fine-grained authorization using Spring Expression Language (SpEL) with `@PreAuthorize`."*

**1. Role Authority Mapping (`CustomerUserDetails.java`):**
```java
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
}
```

**2. Endpoint Protection (`ExamController.java`):**
```java
@RestController
@RequestMapping("/api/exams")
public class ExamController {

    // ADMIN ONLY
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExamResponseDto> createExam(@Valid @RequestBody ExamRequestDto dto) {
        return new ResponseEntity<>(examService.createExam(dto), HttpStatus.CREATED);
    }

    // ADMIN, FACULTY, or STUDENT
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<List<ExamResponseDto>> getAllExams() {
        return ResponseEntity.ok(examService.getAllExams());
    }
}
```

---

# SECTION 2: Top 5 Core Feature Modules with Code & Verbal Scripts

---

## Feature 1: User Authentication & JWT Generation (`UserServiceImpl.java` & `JwtService.java`)

> **Verbal Pitch for Interviewer:**  
> *"When a user logs in via `/api/users/login`, the `UserService` passes credentials to `AuthenticationManager.authenticate()`. This verifies the raw password against the stored BCrypt hash. Once authenticated, `JwtService.generateToken()` constructs a signed HMAC-SHA256 JWT valid for 1 hour."*

```java
// UserServiceImpl.java
@Override
public LoginResponse login(LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
    );

    User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

    UserDetails userDetails = customerUserDetailsService.loadUserByUsername(request.getUsername());
    String token = jwtService.generateToken(userDetails);

    return new LoginResponse(user.getUsername(), user.getRole(), token, "Login Successful");
}

// JwtService.java (JJWT 0.12.6 API)
public String generateToken(UserDetails userDetails) {
    return Jwts.builder()
            .subject(userDetails.getUsername())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + jwtExpiration)) // 3600000 ms = 1 hr
            .signWith(getSignInKey())
            .compact();
}
```

---

## Feature 2: Automated Seating Allocation Algorithm (`SeatAllocationServiceImpl.java`)

> **Verbal Pitch for Interviewer:**  
> *"To prevent manual seating mistakes, I developed `allocateSeats(Long examId)` inside `@Transactional SeatAllocationServiceImpl`. It fetches enrolled students, verifies available room seats, sorts both lists deterministically by roll number and room/row/seat order, and assigns seats in a single database transaction."*

```java
@Service
@Transactional
public class SeatAllocationServiceImpl implements SeatAllocationService {

    @Override
    public List<SeatAllocationResponseDto> allocateSeats(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));

        // 1. Prevent duplicate allocation
        if (!seatAllocationRepository.findByExamId(examId).isEmpty()) {
            throw new IllegalStateException("Seats already allocated for this exam.");
        }

        // 2. Fetch registered students sorted by Roll Number
        List<Student> students = studentSubjectRepository.findBySubjectId(exam.getSubject().getId())
                .stream().map(StudentSubject::getStudent)
                .sorted(Comparator.comparing(Student::getRollNumber))
                .collect(Collectors.toList());

        // 3. Fetch available seats sorted by Room, Row, and Column
        List<Seat> seats = seatRepository.findAll().stream()
                .filter(seat -> seat.getStatus() == SeatStatus.AVAILABLE)
                .sorted(Comparator.comparing((Seat s) -> s.getRoom().getId())
                        .thenComparing(Seat::getRowNumber)
                        .thenComparing(Seat::getColumnNumber))
                .collect(Collectors.toList());

        if (seats.size() < students.size()) {
            throw new IllegalStateException("Insufficient seats available!");
        }

        // 4. Sequential Seat Assignment
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

## Feature 3: OTP Email Password Reset Flow (`UserServiceImpl.java`)

> **Verbal Pitch for Interviewer:**  
> *"For password resets, I implemented a 3-step OTP flow: `forgotPassword`, `verifyOtp`, and `resetPassword`. A 6-digit random OTP with a 5-minute expiration (`LocalDateTime.now().plusMinutes(5)`) is generated and delivered via `EmailService`. Upon verification, the new password is encrypted with `passwordEncoder.encode()` and OTP fields are cleared."*

```java
@Override
public String forgotPassword(ForgotPasswordRequestDto request) {
    User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

    String otp = String.valueOf((int) (Math.random() * 900000) + 100000); // 6-digit OTP
    user.setOtp(otp);
    user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(5));
    userRepository.save(user);

    emailService.sendOtpEmail(user.getEmail(), otp);
    return "OTP sent successfully to your registered email.";
}

@Override
public String resetPassword(ResetPasswordRequestDto request) {
    User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (user.getOtp() == null || !user.getOtp().equals(request.getOtp())) {
        throw new RuntimeException("Invalid OTP.");
    }

    if (user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
        throw new RuntimeException("OTP has expired.");
    }

    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    user.setOtp(null);
    user.setOtpExpiryTime(null);
    userRepository.save(user);

    return "Password reset successfully.";
}
```

---

## Feature 4: Hall Ticket Generation (`HallTicketServiceImpl.java`)

> **Verbal Pitch for Interviewer:**  
> *"After seating allocation is completed, `HallTicketServiceImpl` generates a unique hall ticket number (`HT-XXXXXXXX`) linking the Student, Exam, and SeatAllocation entity."*

```java
@Override
public HallTicketResponseDto generateHallTicket(Long examId, Long studentId) {
    Exam exam = examRepository.findById(examId).orElseThrow();
    Student student = studentRepository.findById(studentId).orElseThrow();

    SeatAllocation allocation = seatAllocationRepository.findByExamAndStudent(exam, student)
            .orElseThrow(() -> new ResourceNotFoundException("Seat allocation not found."));

    HallTicket hallTicket = new HallTicket();
    hallTicket.setExam(exam);
    hallTicket.setStudent(student);
    hallTicket.setSeatAllocation(allocation);
    hallTicket.setHallTicketNumber("HT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

    return hallTicketMapper.toResponseDto(hallTicketRepository.save(hallTicket));
}
```

---

# SECTION 3: 10 Interview Questions with Code Snippets & Answers

### Q1: Why did you use `OncePerRequestFilter` for your JWT Filter?
> **Answer:**  
> *"Generic servlet filters can trigger multiple times per request during internal dispatches like `FORWARD` or `INCLUDE`. `OncePerRequestFilter` guarantees that token parsing and database checks execute **strictly once per HTTP request**."*

---

### Q2: Why did you disable CSRF (`csrf.disable()`)?
> **Answer:**  
> *"CSRF vulnerabilities exploit browser auto-sending of session cookies. In my project, authentication is stateless—clients pass JWTs explicitly via `Authorization: Bearer <token>` in local memory/headers. Since browsers do not attach JWT headers automatically on cross-site requests, CSRF protection is unnecessary."*

---

### Q3: How do you extract the logged-in username inside Service methods without passing parameters?
> **Answer:**  
> *"I access Spring's `ThreadLocal` security context:  
> ```java
> Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
> String username = authentication.getName();
> ```"*

---

### Q4: What happens if a non-admin tries to hit `@PreAuthorize("hasRole('ADMIN')")`?
> **Answer:**  
> *"Spring Security evaluates the SpEL expression before method invocation. If the user's `GrantedAuthorities` list lacks `"ROLE_ADMIN"`, Spring throws an `AccessDeniedException`, which returns an HTTP `403 Forbidden` error to the client."*

---

### Q5: How do React Axios Interceptors handle JWT tokens?
> **Answer:**  
> *"In React, an Axios request interceptor attaches the token stored in `localStorage` to every outgoing API request:  
> ```javascript
> axiosInstance.interceptors.request.use((config) => {
>     const token = localStorage.getItem('token');
>     if (token) config.headers.Authorization = `Bearer ${token}`;
>     return config;
> });
> ```"*

---

### Q6: How does `@Transactional` work in your seating allocation service?
> **Answer:**  
> *"Annotation `@Transactional` wraps the method execution in a database transaction. If an error or exception occurs halfway through saving seat allocations, Spring automatically rolls back all changes, preventing partial or corrupted data."*

---

### Q7: How does JJWT 0.12.6 verify token signatures?
> **Answer:**  
> *"It decodes the Base64 secret key using `Decoders.BASE64.decode(secretKey)`, builds a HMAC SHA key via `Keys.hmacShaKeyFor(keyBytes)`, and uses `Jwts.parser().verifyWith(key).build().parseSignedClaims(token)` to verify that the signature matches."*

---

### Q8: What is the benefit of DTOs over Entity classes in REST APIs?
> **Answer:**  
> *"DTOs (Data Transfer Objects) decouple database schema from API contracts. They prevent over-fetching, eliminate circular JSON serialization issues, and hide sensitive fields like encrypted passwords from API responses."*

---

### Q9: How does password encoding work with BCrypt?
> **Answer:**  
> *"BCrypt generates a random 16-byte salt and hashes the password using an adaptive key-derivation function. Stored hashes take the format `$2a$10$...`. During login, `passwordEncoder.matches(raw, encoded)` extracts the salt from the stored hash and re-hashes the input password to check equality."*

---

### Q10: How would you scale this application to 100,000 students?
> **Answer:**  
> *"1. Add database composite indexing on `username`, `subject_id`, and `exam_id`.  
> 2. Implement pagination via Spring Data JPA `Pageable` on all list APIs.  
> 3. Use Redis caching `@Cacheable` for static metadata like Subject and Department lists."*

