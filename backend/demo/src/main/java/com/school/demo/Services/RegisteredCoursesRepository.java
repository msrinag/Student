package com.school.demo.Services;


import com.school.demo.Entity.Course;
import com.school.demo.Entity.RegisteredCourses;
import com.school.demo.Entity.Student;

import jakarta.transaction.Transactional;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RegisteredCoursesRepository extends JpaRepository<RegisteredCourses, Long> {
    //Set<Course> findByStudents(Student student);
    //Set<RegisteredCourses> findByStudent(Student student);
    @Query("SELECT r.id AS id, r.course.name AS courseName FROM RegisteredCourses r WHERE r.student = :student")
    Set<RegisteredCourseProjection> findByStudent(@Param("student") Student student);

    @Transactional
    void deleteByCourseOfferedCourseId(Long courseId);

    @Modifying
    @Query("DELETE FROM RegisteredCourses rc WHERE rc.course.id = :courseId")
    void deleteByCourseId(@Param("courseId") Long courseId);

    Optional<RegisteredCourses> findByStudentAndCourseOfferedCourse(Student student, Course course);

    @Modifying
    @Transactional
    @Query("DELETE FROM RegisteredCourses rc WHERE rc.student.id = :studentId AND rc.course.id = :courseId")
    void deleteByStudentIdAndCourseId(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
}