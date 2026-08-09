package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.BlockRequestDto;
import com.exam.exam_management_system.dto.BlockResponseDto;
import com.exam.exam_management_system.entity.Block;
import org.springframework.stereotype.Component;

@Component
public class BlockMapper {

    public Block toEntity(BlockRequestDto dto) {
        return Block.builder()
                .blockName(dto.getBlockName())
                .blockCode(dto.getBlockCode())
                .description(dto.getDescription())
                .status(dto.getStatus())
                .build();
    }

    public BlockResponseDto toResponseDto(Block block) {
        return BlockResponseDto.builder()
                .id(block.getId())
                .blockName(block.getBlockName())
                .blockCode(block.getBlockCode())
                .description(block.getDescription())
                .status(block.getStatus())
                .createdAt(block.getCreatedAt())
                .updatedAt(block.getUpdatedAt())
                .build();
    }

    public void updateEntity(Block block, BlockRequestDto dto) {
        block.setBlockName(dto.getBlockName());
        block.setBlockCode(dto.getBlockCode());
        block.setDescription(dto.getDescription());
        block.setStatus(dto.getStatus());
    }
}