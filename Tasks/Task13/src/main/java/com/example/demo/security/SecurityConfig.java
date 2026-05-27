package com.example.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/register").permitAll()
                .anyRequest().permitAll()   // ✅ TEMP FIX (IMPORTANT)
            )
            .formLogin(form -> form.disable())
            .httpBasic(httpBasic -> httpBasic.disable()); // ✅ DISABLE BASIC AUTH

        return http.build();
    }
}