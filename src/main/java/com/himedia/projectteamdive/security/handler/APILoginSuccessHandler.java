package com.himedia.projectteamdive.security.handler;

import com.google.gson.Gson;
import com.himedia.projectteamdive.dto.MemberDto;
import com.himedia.projectteamdive.security.util.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

public class APILoginSuccessHandler implements org.springframework.security.web.authentication.AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        MemberDto memberDto = (MemberDto) authentication.getPrincipal();
        Map<String,Object> claims = memberDto.getClaims();

        String accessToken = JWTUtil.generateToken(claims,1);
        String refreshToken = JWTUtil.generateToken(claims,60*24);

        claims.put("accessToken",accessToken);
        claims.put("refreshToken",refreshToken);

        System.out.println("login success---------------------------------------------------------");
        System.out.println(memberDto);
        Gson gson = new Gson();
        String json = gson.toJson(claims);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        out.print(json);
        out.close();
    }
}
