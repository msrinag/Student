package com.school.demo.Services;


import com.school.demo.DTO.EnrollmentRequest;
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
@RequestMapping("/student")
public class StudentEnrollmentController {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CoursesOfferedRepository coursesOfferedRepository;
    private final RegisteredCoursesRepository registeredCoursesRepository;
    

    @Autowired
    public StudentEnrollmentController(StudentRepository studentRepository, CourseRepository courseRepository, UserRepository userRepository, CoursesOfferedRepository coursesOfferedRepository, RegisteredCoursesRepository registeredCoursesRepository) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.coursesOfferedRepository = coursesOfferedRepository;
        this.registeredCoursesRepository = registeredCoursesRepository;
    }

    @PostMapping("/enrollCourse")
    public ResponseEntity<String> enrollCourse(@RequestBody EnrollmentRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student not found"));
      Long id =Long.parseLong(request.getCourseofferedid());
     
        CoursesOffered coursesOffered = coursesOfferedRepository.findById(id)
              .orElseThrow(() -> new RuntimeException("Course offered not found"));
            
        // Course course=courseRepository.findBycoursesOffered(coursesOffered)
        //     .orElseThrow(() -> new RuntimeException("Course offered not found"));
        
        System.out.println("\n<-here->\n"+student.getName()+student.getId()+coursesOffered.getCourse()+coursesOffered.getTeacher());
        Course c=coursesOffered.getCourse();
        System.out.println(c.getName()+c.getId());

        RegisteredCourses registeredCourses = new RegisteredCourses();
        registeredCourses.setStudent(student);
        registeredCourses.setCourseOffered(coursesOffered);
        //registeredCourses.setCourse();
       // registeredCourses.setCourseid(course);
       registeredCourses.setCourse(c);
        
        System.out.println("\n<-here->\n");
        registeredCoursesRepository.save(registeredCourses);

        return ResponseEntity.ok("Course enrolled successfully!");
    }
}