package com.exam.exam_management_system.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponseDto {

    private Long id;

    private String title;

    private String subtitle;

    private String type;

}