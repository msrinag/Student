package com.school.demo.Services;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.school.demo.Entity.Student;
import com.school.demo.Entity.User;


@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
   Optional<Student> findById(Long id);
    Optional<Student> findByUser(User user);
    
}