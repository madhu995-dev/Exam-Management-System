package com.exam.exam_management_system.repository;

import com.exam.exam_management_system.entity.ExaminationSeries;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExaminationSeriesRepository extends JpaRepository<ExaminationSeries, Long> {

    Optional<ExaminationSeries> findBySeriesName(String seriesName);

    boolean existsBySeriesName(String seriesName);

}