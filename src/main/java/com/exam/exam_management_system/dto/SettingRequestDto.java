package com.exam.exam_management_system.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettingRequestDto {

    private String settingKey;

    private String settingValue;

    private String description;

}