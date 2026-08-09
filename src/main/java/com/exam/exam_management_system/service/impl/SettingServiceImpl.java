package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.SettingRequestDto;
import com.exam.exam_management_system.dto.SettingResponseDto;
import com.exam.exam_management_system.entity.Setting;
import com.exam.exam_management_system.mapper.SettingMapper;
import com.exam.exam_management_system.repository.SettingRepository;
import com.exam.exam_management_system.service.SettingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SettingServiceImpl implements SettingService {

    private final SettingRepository settingRepository;
    private final SettingMapper settingMapper;

    @Override
    public SettingResponseDto createSetting(SettingRequestDto requestDto) {

        if (settingRepository.existsBySettingKey(requestDto.getSettingKey())) {
            throw new RuntimeException("Setting already exists.");
        }

        Setting setting = Setting.builder()
                .settingKey(requestDto.getSettingKey())
                .settingValue(requestDto.getSettingValue())
                .description(requestDto.getDescription())
                .build();

        return settingMapper.toDto(
                settingRepository.save(setting)
        );

    }

    @Override
    public SettingResponseDto updateSetting(Long id,
                                            SettingRequestDto requestDto) {

        Setting setting = settingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Setting not found"));

        setting.setSettingValue(requestDto.getSettingValue());
        setting.setDescription(requestDto.getDescription());

        return settingMapper.toDto(
                settingRepository.save(setting)
        );

    }
    @Override
    public SettingResponseDto getSettingById(Long id) {

        Setting setting = settingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Setting not found"));

        return settingMapper.toDto(setting);

    }

    @Override
    public SettingResponseDto getSettingByKey(String settingKey) {

        Setting setting = settingRepository.findBySettingKey(settingKey)
                .orElseThrow(() -> new RuntimeException("Setting not found"));

        return settingMapper.toDto(setting);

    }

    @Override
    public List<SettingResponseDto> getAllSettings() {

        return settingRepository.findAll()
                .stream()
                .map(settingMapper::toDto)
                .toList();

    }

    @Override
    public void deleteSetting(Long id) {

        Setting setting = settingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Setting not found"));

        settingRepository.delete(setting);

    }

}