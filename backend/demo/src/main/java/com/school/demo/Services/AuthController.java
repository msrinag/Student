package com.school.demo.Services;

import com.school.demo.Entity.*;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.school.demo.Entity.User.Role;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private SecurityConfig securityConfig;

    @Autowired
    private CustomUserDetailsService userDetailsService;  // Injected UserDetailsService

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("User already exists!");
        }

        try {
            Role role = Role.valueOf(request.getRole().toUpperCase());
            User user = new User();
            user.setUsername(request.getUsername());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(role);

            userRepository.save(user);
            if (role == Role.STUDENT) {
                Student student = new Student();
                student.setName(request.getName());
                student.setAddress(request.getAddress());
                student.setUser(user);
                studentRepository.save(student);
                
            } else if (role == Role.TEACHER) {
                Teacher teacher = new Teacher();
                teacher.setName(request.getName());
                teacher.setAddress(request.getAddress());
                //System.out.println(request.getPhoneno());
                teacher.setPhoneNo(request.getPhone_no());
                teacher.setUser(user);
                teacherRepository.save(teacher);
            }
            return ResponseEntity.ok("User registered successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role provided.");
        }
    }

    

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );}catch (BadCredentialsException e) {
        // This is where the password mismatch is caught
        return ResponseEntity.badRequest().body("Invalid username or password");
    } catch (UsernameNotFoundException e) {
        // User is not found
        return ResponseEntity.badRequest().body("User not found");
    }
        
      
        UserDetails user = userDetailsService.loadUserByUsername(request.getUsername());
        Optional<User> useritem = userRepository.findByUsername(request.getUsername());
       // User useritem = (user) user;
        String token = securityConfig.generateToken(user.getUsername(), user.getAuthorities().iterator().next().getAuthority());

        //return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getAuthorities().iterator().next().getAuthority()));
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", user.getUsername());
        response.put("role", user.getAuthorities().iterator().next().getAuthority());

        if (useritem.get().getRole() == User.Role.STUDENT) {
            Optional<Student> studentOptional = studentRepository.findByUser(useritem.get());
            if (studentOptional.isPresent()) {
                response.put("id", studentOptional.get().getId());
            } else {
                response.put("id", null);
            }
        } else if (useritem.get().getRole() == User.Role.TEACHER) {
            Optional<Teacher> teacherOptional = teacherRepository.findByUser(useritem.get());
            if (teacherOptional.isPresent()) {
                response.put("id", teacherOptional.get().getId());
            } else {
                response.put("id", null);
            }
        } else {
            response.put("id", null);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public String test() {
        return "Test endpoint reached!";
    }
}
