package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.BlockRequestDto;
import com.exam.exam_management_system.dto.BlockResponseDto;
import com.exam.exam_management_system.entity.Block;
import com.exam.exam_management_system.exception.ResourceNotFoundException;
import com.exam.exam_management_system.mapper.BlockMapper;
import com.exam.exam_management_system.repository.BlockRepository;
import com.exam.exam_management_system.service.BlockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BlockServiceImpl implements BlockService {

    private final BlockRepository blockRepository;
    private final BlockMapper blockMapper;

    @Override
    public BlockResponseDto createBlock(BlockRequestDto blockRequestDto) {

        if (blockRepository.existsByBlockName(blockRequestDto.getBlockName())) {
            throw new IllegalArgumentException("Block name already exists.");
        }

        if (blockRepository.existsByBlockCode(blockRequestDto.getBlockCode())) {
            throw new IllegalArgumentException("Block code already exists.");
        }

        Block block = blockMapper.toEntity(blockRequestDto);

        Block savedBlock = blockRepository.save(block);

        return blockMapper.toResponseDto(savedBlock);
    }

    @Override
    public List<BlockResponseDto> getAllBlocks() {

        return blockRepository.findAll()
                .stream()
                .map(blockMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public BlockResponseDto getBlockById(Long id) {

        Block block = blockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Block not found with id: " + id));

        return blockMapper.toResponseDto(block);
    }

    @Override
    public BlockResponseDto updateBlock(Long id, BlockRequestDto blockRequestDto) {

        Block block = blockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Block not found with id: " + id));

        if (!block.getBlockName().equals(blockRequestDto.getBlockName())
                && blockRepository.existsByBlockName(blockRequestDto.getBlockName())) {
            throw new IllegalArgumentException("Block name already exists.");
        }

        if (!block.getBlockCode().equals(blockRequestDto.getBlockCode())
                && blockRepository.existsByBlockCode(blockRequestDto.getBlockCode())) {
            throw new IllegalArgumentException("Block code already exists.");
        }

        blockMapper.updateEntity(block, blockRequestDto);

        Block updatedBlock = blockRepository.save(block);

        return blockMapper.toResponseDto(updatedBlock);
    }

    @Override
    public void deleteBlock(Long id) {

        Block block = blockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Block not found with id: " + id));

        blockRepository.delete(block);
    }
}