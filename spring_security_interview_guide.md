# Spring Security & JWT Architecture — Interview Reference Guide
**Project:** Exam Management System (`exam-management-system`)  
**Tech Stack:** Java 21, Spring Boot 3.5.4, Spring Security 6.x, JJWT 0.12.6, MySQL, Swagger/OpenAPI  

---

## 1. High-Level Architecture & Request Flow

Below is the complete request flow when a user interacts with your system:

```
                  +-------------------------------------------------------+
                  |                  Incoming HTTP Request               |
                  +-------------------------------------------------------+
                                              |
                                              v
                  +-------------------------------------------------------+
                  |         SecurityFilterChain (Spring Security 6)       |
                  |  - CSRF: Disabled (Stateless REST API)                |
                  |  - Authorization Rules: permitAll() vs authenticated()|
                  +-------------------------------------------------------+
                                              |
                                              v
                  +-------------------------------------------------------+
                  |        JwtAuthenticationFilter (OncePerRequestFilter) |
                  |  1. Extract Authorization header: "Bearer <token>"   |
                  |  2. Extract username via JwtService                   |
                  |  3. Validate token expiration & signature             |
                  |  4. Load UserDetails via CustomerUserDetailsService   |
                  |  5. Build UsernamePasswordAuthenticationToken          |
                  |  6. Set SecurityContextHolder.getContext()            |
                  +-------------------------------------------------------+
                                              |
                                              v
                  +-------------------------------------------------------+
                  |      Method Security Check (@EnableMethodSecurity)     |
                  |  - Evaluates @PreAuthorize("hasRole('ADMIN')")        |
                  +-------------------------------------------------------+
                                              |
                                              v
                  +-------------------------------------------------------+
                  |                   REST Controller                     |
                  |  - Controller method executes if authorized           |
                  +-------------------------------------------------------+
```

---

## 2. Deep-Dive Code Breakdown by Component

### A. Security Configuration (`SecurityConfig.java`)
- **Key Annotations:** `@Configuration`, `@EnableWebSecurity`, `@EnableMethodSecurity`
- **Spring Security 6 Syntax:** Uses modern **Lambda DSL** (no deprecated `http.csrf().disable()` or `WebSecurityConfigurerAdapter`).

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables @PreAuthorize at method/controller level
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disabled for stateless JWT APIs
            .authorizeHttpRequests(auth -> auth
                // Public Endpoints
                .requestMatchers(
                    "/api/users/register",
                    "/api/users/login",
                    "/api/users/forgot-password",
                    "/api/users/verify-otp",
                    "/api/users/reset-password",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**"
                ).permitAll()

                // Secured Endpoints
                .anyRequest().authenticated()
            )
            // Custom JWT Filter before Spring's default UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // One-way hashing algorithm with salted hashing
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
```

---

### B. Custom JWT Authentication Filter (`JwtAuthenticationFilter.java`)
- **Base Class:** `OncePerRequestFilter` (Guarantees execution once per HTTP request).
- **Core Purpose:** Intercepts incoming requests, extracts the JWT token, validates it, and authenticates the user in Spring's `SecurityContextHolder`.

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final CustomerUserDetailsService customerUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        
        // 1. Check for valid Bearer token format
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        final String username = jwtService.extractUsername(jwt);

        // 2. Validate token and populate SecurityContext if user not already authenticated
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = customerUserDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // 3. Set authentication in thread-local SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

---

### C. UserDetails Adapter & Service (`CustomerUserDetails` & `CustomerUserDetailsService`)
- **`CustomerUserDetails`:** Implements Spring Security's `UserDetails` interface to bridge your database entity `User` with Spring Security.
- **Role Authority Mapping:** Crucial standard: Appends `"ROLE_"` prefix (`"ROLE_" + user.getRole().name()`), turning enum `ADMIN` into GrantedAuthority `"ROLE_ADMIN"`.

```java
public class CustomerUserDetails implements UserDetails {
    private final User user;

    public CustomerUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public String getPassword() { return user.getPassword(); }

    @Override
    public String getUsername() { return user.getUsername(); }

    @Override
    public boolean isEnabled() { return user.getEnabled(); }
    
    // Other account status flags return true...
}
```

- **`CustomerUserDetailsService`:** Implements `UserDetailsService`.
```java
@Service
public class CustomerUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
        return new CustomerUserDetails(user);
    }
}
```

---

### D. JWT Utility Service (`JwtService.java`)
- **JJWT Version:** Uses modern JJWT `0.12.6` fluent builder and parser methods (`parseSignedClaims`, `verifyWith`).
- **Configuration Properties:**
  - `jwt.secret`: Base64 encoded secret key.
  - `jwt.expiration`: Token validity in milliseconds (3,600,000 ms = 1 Hour).

```java
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    // Token Generation
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey())
                .compact();
    }

    // Username Extraction
    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Token Validation
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

---

### E. Authentication Logic (`UserServiceImpl.java`)
1. **User Login Flow:**
   - Calls `authenticationManager.authenticate(...)` with `UsernamePasswordAuthenticationToken(username, password)`.
   - `AuthenticationManager` uses `DaoAuthenticationProvider` to verify raw password against stored BCrypt hash using `passwordEncoder`.
   - Generates JWT token via `JwtService.generateToken(...)` and returns `LoginResponse`.

2. **Accessing Current User Context (e.g., `changePassword`):**
   ```java
   Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
   String currentUsername = authentication.getName();
   ```

---

### F. Method Security & Fine-Grained Authorization
Enabled via `@EnableMethodSecurity` in `SecurityConfig.java`. Controllers use Spring Expression Language (SpEL):

```java
@RestController
@RequestMapping("/api/exams")
public class ExamController {

    // Only users with ROLE_ADMIN can create exams
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExamResponseDto> createExam(@Valid @RequestBody ExamRequestDto requestDto) { ... }

    // Users with ADMIN, FACULTY, or STUDENT roles can view exams
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<List<ExamResponseDto>> getAllExams() { ... }
}
```

---

### G. Swagger / OpenAPI Integration (`SwaggerConfig.java`)
Configures HTTP Bearer Authentication scheme so developers can test JWT tokens directly inside Swagger UI:

```java
@Configuration
@OpenAPIDefinition(info = @Info(title = "Exam Management System API", version = "1.0"))
@SecurityScheme(
        name = "Bearer Authentication",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class SwaggerConfig {}
```

---

## 3. Interview Cheat Sheet & Q&A (Tailored to your Project)

### Q1: Can you walk me through the authentication architecture in your Spring Boot project?
> **Answer:**  
> "In my Exam Management System, I implemented a stateless JWT-based authentication architecture using Spring Security 6 and JJWT 0.12.6.  
> 1. When a user submits credentials to `/api/users/login`, the `UserService` invokes Spring Security's `AuthenticationManager.authenticate()`.  
> 2. It compares the raw password against the stored BCrypt hash fetched by `CustomerUserDetailsService`.  
> 3. Upon successful authentication, a signed JWT containing the username as its subject is returned in the response.  
> 4. For subsequent requests, the client sends `Authorization: Bearer <token>`.  
> 5. My custom `JwtAuthenticationFilter` (extending `OncePerRequestFilter`) intercepts the request, validates the token signature and expiration, retrieves the user's details and authorities (`ROLE_ADMIN`, `ROLE_FACULTY`, or `ROLE_STUDENT`), and sets the `Authentication` object into `SecurityContextHolder`.  
> 6. Finally, `@PreAuthorize` annotations on controllers enforce fine-grained role authorization."

---

### Q2: Why did you use `OncePerRequestFilter` for your JWT filter?
> **Answer:**  
> "`OncePerRequestFilter` guarantees that the filter is executed exactly **once per HTTP request**, even across different servlet containers or asynchronous internal dispatches (such as `FORWARD` or `INCLUDE`). Standard servlet filters might trigger multiple times per request, causing redundant token parsing and database lookups."

---

### Q3: Why did you disable CSRF (`csrf.disable()`) in `SecurityConfig`?
> **Answer:**  
> "CSRF (Cross-Site Request Forgery) attacks rely on browsers automatically attaching session cookies to cross-domain requests. Since my application uses **stateless JWT tokens** stored in client-side state/local storage and passed explicitly via the `Authorization: Bearer` header, browsers do not automatically append JWTs on cross-site requests. Thus, CSRF protection is unnecessary and disabled for stateless REST APIs."

---

### Q4: How does Spring Security map your custom `Role` enum to Spring Security Authorities?
> **Answer:**  
> "Spring Security's `hasRole('ADMIN')` check expects authority strings to start with the `ROLE_` prefix. In my `CustomerUserDetails` class, I implement `UserDetails.getAuthorities()` by mapping my custom `Role` enum to a `SimpleGrantedAuthority`:
> ```java
> new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
> ```
> When evaluating `@PreAuthorize("hasRole('ADMIN')")`, Spring Security automatically checks if the user possesses the authority `"ROLE_ADMIN"`."

---

### Q5: How is password security handled in your system?
> **Answer:**  
> "Passwords are encrypted using `BCryptPasswordEncoder` registered as a `@Bean`. BCrypt is a salted key-derivation function that incorporates an adaptive work factor (cost) and unique random salts for each password, rendering rainbow table and brute-force attacks computationally infeasible."

---

### Q6: How do you extract the currently authenticated user in service methods without passing parameters from the controller?
> **Answer:**  
> "I fetch the security context directly using `SecurityContextHolder`:
> ```java
> Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
> String username = authentication.getName();
> ```
> Since `SecurityContextHolder` uses a `ThreadLocal` strategy by default, each HTTP request thread maintains its own authenticated user state throughout the lifecycle of that thread."

---

### Q7: What are the key differences between Spring Security 5 and Spring Security 6 that you used in this project?
> **Answer:**  
> "1. **Removal of `WebSecurityConfigurerAdapter`:** In Spring Security 6, security is configured component-style by declaring a `SecurityFilterChain` `@Bean`.  
> 2. **Lambda DSL Enforced:** Configuration methods now strictly require lambdas (e.g., `http.csrf(csrf -> csrf.disable())` instead of method chaining).  
> 3. **`authorizeHttpRequests` over `authorizeRequests`:** Spring Security 6 uses `authorizeHttpRequests(auth -> auth.requestMatchers(...))` instead of `antMatchers()`.  
> 4. **Jakarta EE Namespace:** All servlet packages migrated from `javax.servlet` to `jakarta.servlet`."

---

### Q8: How did you implement OTP-based Password Reset alongside Spring Security?
> **Answer:**  
> "Endpoints `/api/users/forgot-password`, `/api/users/verify-otp`, and `/api/users/reset-password` are marked as `.permitAll()` in `SecurityConfig`. When a user requests a reset, a 6-digit random OTP with a 5-minute expiration timestamp is saved in the `users` table and sent via `EmailService`. Upon verification, `passwordEncoder.encode()` hashes the new password and updates the database, clearing the OTP fields."

---

### Q9: How does modern JJWT 0.12.6 differ in your implementation compared to older JJWT versions?
> **Answer:**  
> "JJWT 0.12.6 replaced deprecated methods like `Jwts.parserBuilder()` and `parseClaimsJws()`. In my `JwtService`:  
> - Signing uses `signWith(getSignInKey())` with `SecretKey` generated from `Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey))`.  
> - Token parsing uses `Jwts.parser().verifyWith(getSignInKey()).build().parseSignedClaims(token).getPayload()`, adhering to modern type-safe builder patterns."

---

### Q10: What roles exist in your project, and how are permissions structured?
> **Answer:**  
> "The system defines 3 roles in the `Role` enum: `ADMIN`, `FACULTY`, and `STUDENT`.
> - **ADMIN:** Full CRUD access to users, departments, courses, exams, hall tickets, and seating allocations.
> - **FACULTY:** Access to assigned invigilations, attendance entry, student results, and viewing schedules.
> - **STUDENT:** Read-only access to their individual hall tickets, exam timetable, and result scorecards."

---

## 4. Key Summary Table

| Component | Class Name | Main Responsibility |
| :--- | :--- | :--- |
| **Security Configuration** | `SecurityConfig` | Defines `SecurityFilterChain`, CSRF policy, public/secured URL matchers, PasswordEncoder, and Filter ordering. |
| **JWT Filter** | `JwtAuthenticationFilter` | Intercepts HTTP requests, validates `Bearer` JWT token, sets `Authentication` in `SecurityContextHolder`. |
| **User Details Adapter** | `CustomerUserDetails` | Adapts custom `User` entity to Spring Security's `UserDetails` contract & maps roles to `ROLE_*` authorities. |
| **User Details Service** | `CustomerUserDetailsService` | Loads user from MySQL DB via `UserRepository.findByUsername()`. |
| **JWT Service** | `JwtService` | Generates JWT tokens, verifies signatures with HMAC-SHA, extracts claims/username, checks expiration. |
| **Authentication Controller/Service**| `UserController` / `UserServiceImpl` | Handles `/login`, `/register`, password change, and OTP reset via `AuthenticationManager`. |
| **Method Security** | `@PreAuthorize` | Enforces method-level Role-Based Access Control (RBAC) on REST controllers. |
| **Swagger Security** | `SwaggerConfig` | Configures OpenAPI `Bearer` authentication schema for testing in Swagger UI. |

