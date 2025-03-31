package com.school.demo.Services;




import com.school.demo.Entity.Course;
import com.school.demo.Entity.RegisteredCourses;
import com.school.demo.Entity.Student;
import com.school.demo.Entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseRepository courseRepository;

    @DeleteMapping("/{courseId}/teacher/{teacherId}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long courseId,
                                               @PathVariable Long teacherId) { // Example: Teacher ID for authorization
        try {
            System.out.println("start");
            courseService.deleteCourse(courseId, teacherId); // Pass teacherId for authorization
            return ResponseEntity.ok("Course deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage()+"failed!");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        if (!courses.isEmpty()) {
            List<Map<String, Object>> courseList = courses.stream()
                    .map(course -> {
                        Map<String, Object> courseMap = new HashMap<>();
                        courseMap.put("id", course.getId());
                        courseMap.put("name", course.getName());
                        return courseMap;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(courseList);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


   
}