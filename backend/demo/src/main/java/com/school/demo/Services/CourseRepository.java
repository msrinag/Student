package com.school.demo.Services;

import org.springframework.stereotype.Repository;
import com.school.demo.Entity.*;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Set<Course> findByStudents(Student student);

    
    //Optional<Course> findBycoursesOffered(CoursesOffered coursesOffered);
}