package com.ppmp.modules.technology.service;

import com.ppmp.modules.technology.dto.TechnologyDto;
import com.ppmp.modules.technology.dto.TechnologyRequest;
import com.ppmp.modules.technology.entity.Technology;
import com.ppmp.modules.technology.repository.TechnologyRepository;
import com.ppmp.shared.exception.DuplicateResourceException;
import com.ppmp.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TechnologyService {

    private final TechnologyRepository technologyRepository;

    @Cacheable(value = "technologies", key = "#page + '-' + #size")
    public Page<TechnologyDto> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "name"));
        return technologyRepository.findAll(pageable).map(this::toDto);
    }

    public List<TechnologyDto> getAllList() {
        return technologyRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream().map(this::toDto).toList();
    }

    public TechnologyDto getById(UUID id) {
        return toDto(getTechnology(id));
    }

    @Transactional
    @CacheEvict(value = "technologies", allEntries = true)
    public TechnologyDto create(TechnologyRequest request) {
        if (technologyRepository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException("Technology '" + request.getName() + "' already exists");
        }
        Technology technology = Technology.builder()
                .name(request.getName().trim())
                .category(request.getCategory() != null ? request.getCategory() : com.ppmp.shared.enums.TechnologyCategory.OTHER)
                .iconUrl(request.getIconUrl())
                .build();
        return toDto(technologyRepository.save(technology));
    }

    @Transactional
    @CacheEvict(value = "technologies", allEntries = true)
    public TechnologyDto update(UUID id, TechnologyRequest request) {
        Technology technology = getTechnology(id);
        technology.setName(request.getName().trim());
        if (request.getCategory() != null) {
            technology.setCategory(request.getCategory());
        }
        technology.setIconUrl(request.getIconUrl());
        return toDto(technologyRepository.save(technology));
    }

    @Transactional
    @CacheEvict(value = "technologies", allEntries = true)
    public void delete(UUID id) {
        Technology technology = getTechnology(id);
        technologyRepository.delete(technology);
    }

    @Transactional(readOnly = true)
    public Set<Technology> findByIds(Set<UUID> ids) {
        return Set.copyOf(technologyRepository.findByIdIn(List.copyOf(ids)));
    }

    public Technology getTechnology(UUID id) {
        return technologyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technology not found"));
    }

    public TechnologyDto toDto(Technology technology) {
        return TechnologyDto.builder()
                .id(technology.getId())
                .name(technology.getName())
                .category(technology.getCategory())
                .iconUrl(technology.getIconUrl())
                .build();
    }
}
