package com.findit.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web Configuration class for centralizing CORS (Cross-Origin Resource Sharing).
 * 
 * Explanation for Interviews:
 * Centralizing CORS here instead of putting @CrossOrigin on every Controller
 * keeps controller code clean and allows all endpoints to accept requests from
 * the React frontend running on http://localhost:5173.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
