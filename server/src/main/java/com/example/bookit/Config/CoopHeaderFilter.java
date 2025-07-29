package com.example.bookit.Config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CoopHeaderFilter extends HttpFilter {

    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        // Forzar el header Cross-Origin-Opener-Policy para evitar bloqueos
        response.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
        // Forzar el header Cross-Origin-Embedder-Policy para evitar bloqueos
        response.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");

        chain.doFilter(request, response);
    }
}
