package com.school.demo.Services;



import com.school.demo.Entity.Course;
import com.school.demo.Entity.CoursesOffered;
import com.school.demo.Entity.Student;
import com.school.demo.Entity.Teacher;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CoursesOfferedRepository extends JpaRepository<CoursesOffered, Long> {
    
    Optional<CoursesOffered> findById(Long id);
     @Query("SELECT c.id AS id, c.course.name AS courseName FROM CoursesOffered c WHERE c.teacher = :teacher")
    Set<CoursesOfferedProjection> findByTeacher(@Param("teacher") Teacher teacher);

    @Modifying
@Query("DELETE FROM CoursesOffered co WHERE co.course.id = :courseId")
void deleteByCourseId(@Param("courseId") Long courseId);
    
   // Optional<CoursesOffered> findByStudent(Student student);
}