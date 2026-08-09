package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.SearchResponseDto;
import org.springframework.stereotype.Component;

@Component
public class SearchMapper {

    public SearchResponseDto build(Long id,
                                   String title,
                                   String subtitle,
                                   String type) {

        return SearchResponseDto.builder()
                .id(id)
                .title(title)
                .subtitle(subtitle)
                .type(type)
                .build();

    }

}