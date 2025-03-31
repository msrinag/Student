package com.school.demo.Services;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.school.demo.Entity.Teacher;
import com.school.demo.Entity.User;


@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
     Optional<Teacher> findById(Long id);
     Optional<Teacher> findByUser(User user);

    // Additional custom queries (if needed) can be added here
}
