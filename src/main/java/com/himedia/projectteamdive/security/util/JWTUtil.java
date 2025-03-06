package com.himedia.projectteamdive.security.util;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.InvalidClaimException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.sql.Date;
import java.time.ZonedDateTime;
import java.util.Map;

public class JWTUtil {
    private static String key = "1234567890123456789012345678901234567890";

    public static String generateToken(Map<String, Object> claims,int i) {
        SecretKey key1=null;
        try{
            key1= Keys.hmacShaKeyFor(JWTUtil.key.getBytes("utf-8"));
        }catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }
        String jwtStr= Jwts.builder()
                .setHeader(Map.of("typ","JWT"))
                .setClaims(claims)
                .setIssuedAt(Date.from(ZonedDateTime.now().toInstant()))
                .setExpiration(Date.from(ZonedDateTime.now().plusMinutes(i).toInstant()))
                .signWith(key1)
                .compact();
        return jwtStr;
    }

    public static Map<String, Object> validateToken(String accsessToken) throws CustomJWTException {
        Map<String,Object> claims=null;
        SecretKey key=null;
        try{
            key=Keys.hmacShaKeyFor(JWTUtil.key.getBytes("utf-8"));
            claims=Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(accsessToken)
                    .getBody();
        }catch (ExpiredJwtException expiredJwtException){
            throw new CustomJWTException("Expired");
        }catch(InvalidClaimException invalidClaimException){
            throw new CustomJWTException("Invalid");
        }catch(JwtException jwtException){
            throw new CustomJWTException("JWTError");
        }catch(Exception e){
            throw new CustomJWTException("Error");
        }
        return claims;
    }
}
