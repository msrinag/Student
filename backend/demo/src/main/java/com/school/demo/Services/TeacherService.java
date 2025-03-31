package com.school.demo.Services;

import com.school.demo.Entity.Teacher;
import com.school.demo.DTO.TeacherUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    public Teacher updateTeacher(Long teacherId, TeacherUpdateRequest updateRequest) {
        Optional<Teacher> optionalTeacher = teacherRepository.findById(teacherId);
        if (optionalTeacher.isPresent()) {
            Teacher teacher = optionalTeacher.get();
            if (updateRequest.getName() != null) {
                teacher.setName(updateRequest.getName());
            }
            if (updateRequest.getAddress() != null) {
                teacher.setAddress(updateRequest.getAddress());
            }
            // Update other fields as needed
            return teacherRepository.save(teacher);
        } else {
            return null; // Or throw an exception
        }
    }
}