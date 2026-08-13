package com.ppmp.modules.portfolio.controller;

import com.ppmp.modules.portfolio.dto.PortfolioSettingsDto;
import com.ppmp.modules.portfolio.dto.PortfolioSettingsRequest;
import com.ppmp.modules.portfolio.dto.PublicPortfolioDto;
import com.ppmp.modules.portfolio.service.PortfolioService;
import com.ppmp.shared.response.ApiResponse;
import com.ppmp.shared.util.SecurityUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/portfolio")
@RequiredArgsConstructor
@Tag(name = "Portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PortfolioSettingsDto>> getMyPortfolio() {
        return ResponseEntity.ok(ApiResponse.ok("My portfolio",
                portfolioService.getMyPortfolio(SecurityUtil.getCurrentUserId())));
    }

    @PutMapping("/me/settings")
    public ResponseEntity<ApiResponse<PortfolioSettingsDto>> updateSettings(
            @Valid @RequestBody PortfolioSettingsRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Portfolio settings updated",
                portfolioService.updateSettings(SecurityUtil.getCurrentUserId(), request)));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<PublicPortfolioDto>> getPublicPortfolio(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok("Public portfolio", portfolioService.getPublicPortfolio(slug)));
    }

    @PostMapping("/me/export-pdf")
    public ResponseEntity<byte[]> exportPdf() {
        byte[] pdf = portfolioService.exportPortfolioPdf(SecurityUtil.getCurrentUserId());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=portfolio.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
