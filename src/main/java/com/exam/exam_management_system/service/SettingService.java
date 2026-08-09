package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.SettingRequestDto;
import com.exam.exam_management_system.dto.SettingResponseDto;

import java.util.List;

public interface SettingService {

    SettingResponseDto createSetting(SettingRequestDto requestDto);

    SettingResponseDto updateSetting(Long id, SettingRequestDto requestDto);

    SettingResponseDto getSettingById(Long id);

    SettingResponseDto getSettingByKey(String settingKey);

    List<SettingResponseDto> getAllSettings();

    void deleteSetting(Long id);

}