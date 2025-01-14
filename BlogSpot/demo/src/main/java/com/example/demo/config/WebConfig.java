package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Cho phép frontend từ localhost:3000 gọi API backend
        registry.addMapping("/api/**")
                .allowedOrigins("http://127.0.0.1:5500")  // Cổng frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")  // Cho phép tất cả các headers
                .allowCredentials(true);
    }
}
