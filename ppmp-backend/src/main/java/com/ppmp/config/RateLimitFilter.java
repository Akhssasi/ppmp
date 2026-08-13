package com.ppmp.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    private final int maxRequests;
    private final Map<String, Window> counters = new ConcurrentHashMap<>();

    public RateLimitFilter(@Value("${app.rate-limit.max-requests-per-minute:100}") int maxRequests) {
        this.maxRequests = maxRequests;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String key = request.getRemoteAddr();
        long now = System.currentTimeMillis();
        Window window = counters.computeIfAbsent(key, k -> new Window(now));
        synchronized (window) {
            if (now - window.startedAt > 60_000) {
                window.startedAt = now;
                window.count = 0;
            }
            window.count++;
            if (window.count > maxRequests) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"success\":false,\"status\":429,\"message\":\"Too many requests. Please slow down.\"}");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private static class Window {
        long startedAt;
        int count;
        Window(long startedAt) {
            this.startedAt = startedAt;
        }
    }
}
