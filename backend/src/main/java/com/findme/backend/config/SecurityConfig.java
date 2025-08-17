package com.findme.backend.config;

import com.findme.backend.filter.JwtAuthFilter; // Will be created later
import com.findme.backend.auth.OAuth2SuccessHandler; // Will be created later
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final JwtAuthFilter jwtAuthFilter; // Will be injected

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, HandlerMappingIntrospector introspector) throws Exception {
        MvcRequestMatcher.Builder mvcMatcherBuilder = new MvcRequestMatcher.Builder(introspector);

        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless API
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Use stateless sessions
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(mvcMatcherBuilder.pattern("/api/health")).permitAll()
                .requestMatchers(mvcMatcherBuilder.pattern("/api/public/**")).permitAll() // Public API endpoints
                .requestMatchers(mvcMatcherBuilder.pattern("/oauth2/authorization/**")).permitAll() // OAuth2 login initiation
                .requestMatchers(mvcMatcherBuilder.pattern("/login/oauth2/code/**")).permitAll() // OAuth2 redirect URI
                .requestMatchers(mvcMatcherBuilder.pattern("/h2-console/**")).permitAll() // H2 console
                .requestMatchers(mvcMatcherBuilder.pattern("/swagger-ui/**")).permitAll() // Swagger UI
                .requestMatchers(mvcMatcherBuilder.pattern("/v3/api-docs/**")).permitAll() // OpenAPI docs
                .anyRequest().authenticated() // All other requests require authentication
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2SuccessHandler) // Custom success handler for JWT generation
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class) // Add JWT filter
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin())); // Allow H2 console frames

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
