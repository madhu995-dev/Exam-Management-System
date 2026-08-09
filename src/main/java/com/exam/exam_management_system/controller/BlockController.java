package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.BlockRequestDto;
import com.exam.exam_management_system.dto.BlockResponseDto;
import com.exam.exam_management_system.service.BlockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;

@RestController
@RequestMapping("/api/blocks")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class BlockController {

    private final BlockService blockService;

    // ===========================
    // CREATE BLOCK
    // ADMIN ONLY
    // ===========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlockResponseDto> createBlock(
            @Valid @RequestBody BlockRequestDto blockRequestDto) {

        return new ResponseEntity<>(
                blockService.createBlock(blockRequestDto),
                HttpStatus.CREATED
        );
    }

    // ===========================
    // GET ALL BLOCKS
    // ADMIN, FACULTY
    // ===========================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<List<BlockResponseDto>> getAllBlocks() {

        return ResponseEntity.ok(blockService.getAllBlocks());
    }

    // ===========================
    // GET BLOCK BY ID
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<BlockResponseDto> getBlockById(@PathVariable Long id) {

        return ResponseEntity.ok(blockService.getBlockById(id));
    }

    // ===========================
    // UPDATE BLOCK
    // ADMIN ONLY
    // ===========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlockResponseDto> updateBlock(
            @PathVariable Long id,
            @Valid @RequestBody BlockRequestDto blockRequestDto) {

        return ResponseEntity.ok(
                blockService.updateBlock(id, blockRequestDto)
        );
    }

    // ===========================
    // DELETE BLOCK
    // ADMIN ONLY
    // ===========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteBlock(@PathVariable Long id) {

        blockService.deleteBlock(id);

        return ResponseEntity.ok("Block deleted successfully.");
    }
}