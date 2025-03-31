package com.school.demo.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import Transactional
import com.school.demo.Entity.*;

@Service
public class CourseService {

    @Autowired
    private CoursesOfferedRepository coursesOfferedRepository;
    @Autowired
    private RegisteredCoursesRepository registeredCoursesRepository;
    @Autowired
    private CourseRepository courseRepository;

    @Transactional // Add Transactional annotation
    public void deleteCourse(Long courseId, Long teacherId) {
        // Step 1: Remove all student registrations for this course
        System.out.println("step1" + courseId);
        registeredCoursesRepository.deleteByCourseId(courseId); // Delete registered courses first
        System.out.println("step2");
        // Step 2: Remove course-teacher assignments from courses_offered
        coursesOfferedRepository.deleteByCourseId(courseId);
        System.out.println("step3");
        // Step 3: Finally, delete the course itself
        courseRepository.deleteById(courseId);
        System.out.println("done");
    }
}