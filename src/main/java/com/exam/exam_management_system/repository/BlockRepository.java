package com.exam.exam_management_system.repository;

import com.exam.exam_management_system.entity.Block;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlockRepository extends JpaRepository<Block, Long> {

    Optional<Block> findByBlockName(String blockName);

    Optional<Block> findByBlockCode(String blockCode);

    boolean existsByBlockName(String blockName);

    boolean existsByBlockCode(String blockCode);

}