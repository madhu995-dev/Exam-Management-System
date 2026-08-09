package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.SettingRequestDto;
import com.exam.exam_management_system.dto.SettingResponseDto;
import com.exam.exam_management_system.service.SettingService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class SettingController {

    private final SettingService settingService;

    // ===========================
    // CREATE SETTING
    // ADMIN ONLY
    // ===========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SettingResponseDto> createSetting(
            @RequestBody SettingRequestDto requestDto) {

        return new ResponseEntity<>(
                settingService.createSetting(requestDto),
                HttpStatus.CREATED
        );
    }

    // ===========================
    // UPDATE SETTING
    // ADMIN ONLY
    // ===========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SettingResponseDto> updateSetting(
            @PathVariable Long id,
            @RequestBody SettingRequestDto requestDto) {

        return ResponseEntity.ok(
                settingService.updateSetting(id, requestDto)
        );
    }

    // ===========================
    // GET SETTING BY ID
    // ADMIN ONLY
    // ===========================
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SettingResponseDto> getSettingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                settingService.getSettingById(id)
        );
    }

    // ===========================
    // GET SETTING BY KEY
    // ADMIN ONLY
    // ===========================
    @GetMapping("/key/{settingKey}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SettingResponseDto> getSettingByKey(
            @PathVariable String settingKey) {

        return ResponseEntity.ok(
                settingService.getSettingByKey(settingKey)
        );
    }

    // ===========================
    // GET ALL SETTINGS
    // ADMIN ONLY
    // ===========================
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SettingResponseDto>> getAllSettings() {

        return ResponseEntity.ok(
                settingService.getAllSettings()
        );
    }

    // ===========================
    // DELETE SETTING
    // ADMIN ONLY
    // ===========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteSetting(
            @PathVariable Long id) {

        settingService.deleteSetting(id);

        return ResponseEntity.ok("Setting deleted successfully.");
    }

}