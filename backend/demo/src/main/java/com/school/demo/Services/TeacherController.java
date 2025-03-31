package com.school.demo.Services;

import com.school.demo.Entity.Student;
import com.school.demo.Entity.Teacher;
import com.school.demo.DTO.TeacherUpdateRequest;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private TeacherRepository teacherRepository;


    @PutMapping("/{teacherId}")
    public ResponseEntity<?> updateTeacher(@PathVariable Long teacherId, @RequestBody TeacherUpdateRequest updateRequest) {
        Teacher updatedTeacher = teacherService.updateTeacher(teacherId, updateRequest);
        if (updatedTeacher != null) {
            return ResponseEntity.ok("updatedTeacher");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{teacherId}")
    public ResponseEntity<?> getTeacherDetails(@PathVariable Long teacherId) {
        Optional<Teacher> teacherOptional = teacherRepository.findById(teacherId);
        if (teacherOptional.isPresent()) {
            Teacher teacher = teacherOptional.get();
            Map<String, Object> response = new HashMap<>();
            response.put("name", teacher.getName());
            response.put("address", teacher.getAddress());
            response.put("phoneNo", teacher.getPhoneNo());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}