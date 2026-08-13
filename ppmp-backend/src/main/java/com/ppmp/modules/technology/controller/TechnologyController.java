package com.ppmp.modules.technology.controller;

import com.ppmp.modules.technology.dto.TechnologyDto;
import com.ppmp.modules.technology.dto.TechnologyRequest;
import com.ppmp.modules.technology.service.TechnologyService;
import com.ppmp.shared.constants.AppConstants;
import com.ppmp.shared.response.ApiResponse;
import com.ppmp.shared.response.PagedResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/technologies")
@RequiredArgsConstructor
@Tag(name = "Technologies")
public class TechnologyController {

    private final TechnologyService technologyService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<TechnologyDto>>> getAll(
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return ResponseEntity.ok(ApiResponse.ok("Technologies",
                PagedResponse.from(technologyService.getAll(page, size), t -> t)));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<TechnologyDto>>> getAllList() {
        return ResponseEntity.ok(ApiResponse.ok("Technologies", technologyService.getAllList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TechnologyDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("Technology", technologyService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<TechnologyDto>> create(@Valid @RequestBody TechnologyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Technology created", technologyService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<TechnologyDto>> update(@PathVariable UUID id, @Valid @RequestBody TechnologyRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Technology updated", technologyService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        technologyService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Technology deleted", null));
    }
}
