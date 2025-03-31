package com.school.demo.Services;


import com.school.demo.DTO.CourseCreationRequest;
import com.school.demo.Entity.*;
import com.school.demo.Services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teacher")
public class TeacherCourseController {

    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CoursesOfferedRepository coursesOfferedRepository;

    @Autowired
    public TeacherCourseController(TeacherRepository teacherRepository, CourseRepository courseRepository, UserRepository userRepository, CoursesOfferedRepository coursesOfferedRepository) {
        this.teacherRepository = teacherRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.coursesOfferedRepository = coursesOfferedRepository;
    }

    @PostMapping("/createCourse")
    public ResponseEntity<String> createCourse(@RequestBody CourseCreationRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Teacher teacher = teacherRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Course course = new Course();
        course.setName(request.getName());
        courseRepository.save(course);

        CoursesOffered coursesOffered = new CoursesOffered();
        coursesOffered.setTeacher(teacher);
        coursesOffered.setCourse(course);
        System.out.println(request+"\nhere->\n");
        coursesOfferedRepository.save(coursesOffered);

        return ResponseEntity.ok("Course created successfully!");
    }
}