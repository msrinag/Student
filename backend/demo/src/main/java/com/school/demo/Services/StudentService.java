package com.school.demo.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.school.demo.Entity.*;

import jakarta.transaction.Transactional;
import java.util.*;
import  com.school.demo.DTO.*;
@Service
public class StudentService {

    @Autowired
    private RegisteredCoursesRepository registeredCoursesRepository;

    @Transactional
    public void dropCourse(Long studentId, Long courseId) {
        registeredCoursesRepository.deleteByStudentIdAndCourseId(studentId, courseId);
    }
    @Autowired
    private StudentRepository studentRepository;

    public Student updateStudent(Long studentId, StudentUpdateRequest updateRequest) {
        Optional<Student> optionalStudent = studentRepository.findById(studentId);
        if (optionalStudent.isPresent()) {
            Student student = optionalStudent.get();
            if (updateRequest.getName() != null) {
                student.setName(updateRequest.getName());
            }
            if (updateRequest.getAddress() != null) {
                student.setAddress(updateRequest.getAddress());
            }
            // Update other fields as needed
            return studentRepository.save(student);
        } else {
            return null; // Or throw an exception
        }
    }
}
