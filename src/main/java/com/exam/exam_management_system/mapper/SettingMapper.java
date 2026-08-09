package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.SettingResponseDto;
import com.exam.exam_management_system.entity.Setting;
import org.springframework.stereotype.Component;

@Component
public class SettingMapper {

    public SettingResponseDto toDto(Setting setting) {

        return SettingResponseDto.builder()
                .id(setting.getId())
                .settingKey(setting.getSettingKey())
                .settingValue(setting.getSettingValue())
                .description(setting.getDescription())
                .createdAt(setting.getCreatedAt())
                .updatedAt(setting.getUpdatedAt())
                .build();

    }

}