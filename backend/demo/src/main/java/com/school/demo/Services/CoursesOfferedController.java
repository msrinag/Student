package com.school.demo.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.school.demo.Entity.Student;
import com.school.demo.Entity.Teacher;
import java.util.*;

    
@RestController
@RequestMapping("/api/courses-offered")
public class CoursesOfferedController {

    @Autowired
    private CoursesOfferedRepository coursesOfferedRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @GetMapping("/{teacherId}")
    public Set<CoursesOfferedProjection> getCoursesByTeacher(@PathVariable Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                          .orElseThrow(() -> new RuntimeException("Teacher not found"));
        return coursesOfferedRepository.findByTeacher(teacher);
    }
}