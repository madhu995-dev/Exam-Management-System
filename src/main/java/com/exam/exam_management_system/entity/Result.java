package com.exam.exam_management_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "results",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"exam_id", "student_id"})
        }
)
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(nullable = false)
    private Integer internalMarks;

    @Column(nullable = false)
    private Integer externalMarks;

    @Column
    private Integer practicalMarks;

    @Column(nullable = false)
    private Integer totalMarks;

    @Column(nullable = false)
    private Double percentage;

    @Column(nullable = false, length = 2)
    private String grade;

    @Column(nullable = false)
    private Boolean pass;

    @Column(length = 255)
    private String remarks;

    @Column(nullable = false, updatable = false)
    private LocalDateTime publishedAt;

    @PrePersist
    public void prePersist() {
        this.publishedAt = LocalDateTime.now();
    }
}