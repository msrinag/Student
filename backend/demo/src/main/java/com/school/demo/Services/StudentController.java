package com.school.demo.Services;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import  com.school.demo.DTO.*;

import java.util.*;

import com.school.demo.Entity.Student;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentRepository studentRepository;

    @DeleteMapping("/{studentId}/courses/{courseId}")
    public ResponseEntity<String> dropCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        try {
            System.out.println("sfsfsfsf");
            studentService.dropCourse(studentId, courseId);
            return ResponseEntity.ok("Course dropped successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{studentId}")
    public ResponseEntity<?> updateStudent(@PathVariable Long studentId, @RequestBody StudentUpdateRequest updateRequest) {
        Student updatedStudent = studentService.updateStudent(studentId, updateRequest);
        if (updatedStudent != null) {
            return ResponseEntity.ok("updatedStudent");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<?> getStudentDetails(@PathVariable Long studentId) {
        Optional<Student> studentOptional = studentRepository.findById(studentId);
        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();
            Map<String, Object> response = new HashMap<>();
            response.put("name", student.getName());
            response.put("address", student.getAddress());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}