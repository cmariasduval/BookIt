package com.example.bookit.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Permitir CORS en las rutas que comienzan con /api/
                .allowedOrigins("http://localhost:3000") // Origen del frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS"). allowedHeaders("*") // Métodos permitidos
                .allowCredentials(true); // Permitir credenciales (si es necesario)

    }

}