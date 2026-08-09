package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.BlockRequestDto;
import com.exam.exam_management_system.dto.BlockResponseDto;

import java.util.List;

public interface BlockService {

    BlockResponseDto createBlock(BlockRequestDto blockRequestDto);

    List<BlockResponseDto> getAllBlocks();

    BlockResponseDto getBlockById(Long id);

    BlockResponseDto updateBlock(Long id, BlockRequestDto blockRequestDto);

    void deleteBlock(Long id);

}