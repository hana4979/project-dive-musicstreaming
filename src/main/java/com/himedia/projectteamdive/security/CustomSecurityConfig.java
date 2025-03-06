package com.himedia.projectteamdive.security;

import com.himedia.projectteamdive.security.filter.JWTCheckFilter;
import com.himedia.projectteamdive.security.handler.APILoginFailHandler;
import com.himedia.projectteamdive.security.handler.APILoginSuccessHandler;
import com.himedia.projectteamdive.security.handler.CustomAccessDeniedHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CustomSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("Security Filter Chain - Security Config Start------------------------------------------------");
        //허용한 요청만 처리하는 cors 설정
        http.cors(httpSecurityCorsConfigurer -> {
            httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource());
        });
        //csrf설정 비활성화
        http.csrf(config -> {config.disable();});
        //client 정보 session관리 안함
        http.sessionManagement(
                SessionConfig->SessionConfig.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );

        //로그인기능
        http.formLogin(config ->{
            config.loginPage("/member/login");  // 추후에 /api추가
            config.successHandler(new APILoginSuccessHandler());
            config.failureHandler(new APILoginFailHandler());
        });
        http.addFilterBefore(new JWTCheckFilter(), UsernamePasswordAuthenticationFilter.class);

        http.exceptionHandling(config -> {
            config.accessDeniedHandler(new CustomAccessDeniedHandler());
        });

        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns( Arrays.asList("*"));
        configuration.setAllowedOrigins( Arrays.asList("http://localhost:5173","http://localhost:5174"));
        configuration.setAllowedMethods( Arrays.asList("HEAD","GET","POST","PUT","DELETE"));
        configuration.setAllowedHeaders( Arrays.asList("Authorization","Cache-Control","Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
