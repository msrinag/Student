package com.school.demo.Entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;

@Entity
@Table(name = "courses_offered")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CoursesOffered {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Unique ID for this teacher-course relationship

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    @JsonManagedReference
    private Teacher teacher;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    @JsonManagedReference
    private Course course;

    @OneToMany(mappedBy = "courseOffered", cascade = CascadeType.REMOVE)
private Set<RegisteredCourses> registeredStudents;

    // Getters & Setters
}
