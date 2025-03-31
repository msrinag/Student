package com.school.demo.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.school.demo.Entity.*;
import com.school.demo.Services.RegisteredCoursesRepository;
import com.school.demo.Services.StudentRepository;
import java.util.*;


@RestController
@RequestMapping("/api/registered-courses")
public class RegisteredCourseController {

    @Autowired
    private RegisteredCoursesRepository registeredCoursesRepository;

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/{studentId}")
    public Set<RegisteredCourseProjection> getCoursesByStudent(@PathVariable Long studentId) {
        Student student = studentRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        return registeredCoursesRepository.findByStudent(student);
    }
}