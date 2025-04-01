package com.example.bookit.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterchain securityFilterchain(HttpSecurity httpSecurity) throws Exception{
        return httpSecurity
                .formLogin(httpform -> {
                    httpform
                            .loginPage( )
                })
    }
}
