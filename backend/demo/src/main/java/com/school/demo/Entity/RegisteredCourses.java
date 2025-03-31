package com.school.demo.Entity;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "registered_courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisteredCourses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    @JsonManagedReference
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_offered_id", nullable = false)
    @JsonManagedReference
    private CoursesOffered courseOffered;  // Now references the teacher-course combination

    @ManyToOne
@JoinColumn(name = "course_id", nullable = false)
@OnDelete(action = OnDeleteAction.CASCADE)  // Ensures deletion when course is removed
private Course course;

    // Getters & Setters
}
