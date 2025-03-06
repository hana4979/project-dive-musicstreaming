package com.himedia.projectteamdive.controller;

import com.google.gson.Gson;
import com.himedia.projectteamdive.dto.KakaoProfile;
import com.himedia.projectteamdive.dto.OAuthToken;
import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.entity.RoleName;
import com.himedia.projectteamdive.security.util.CustomJWTException;
import com.himedia.projectteamdive.security.util.JWTUtil;
import com.himedia.projectteamdive.service.MemberService;
import com.himedia.projectteamdive.service.MembershipService;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

@RestController
@RequestMapping("/api/member")
public class MemberController {

    @Autowired
    MemberService ms;

    @GetMapping("/test")
    public String index(){
        return "<h1>Welcome to MusicStreaming World</h1>";
    }

    @GetMapping("/refresh")
    public HashMap<String, Object> refresh(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("refreshToken") String refreshToken) throws CustomJWTException {
        HashMap<String, Object> result = new HashMap<>();
        if( refreshToken == null){
            throw new CustomJWTException("NULL_REFRESHTOKEN");
        }
        if( authHeader == null || authHeader.length()<7){
            throw new CustomJWTException("INVALID_TOKEN");
        }
        String accessToken = authHeader.substring(7);

        boolean expiredResult = checkExpiredToken( accessToken );
        if( expiredResult){
            System.out.println("Remain to TOKEN");
            result.put("accessToken", accessToken);
            result.put("refreshToken", refreshToken);
        }else{
            System.out.println("exchange to TOKEN");

            Map<String, Object> claims = JWTUtil.validateToken(refreshToken);

            String newAccessToken = JWTUtil.generateToken(claims, 1);
            String newRefreshToken = "";
            if(checkTime((Integer)claims.get("exp"))){
                newRefreshToken = JWTUtil.generateToken(claims, 60*24);
            }else{
                newRefreshToken = refreshToken;
            }
            result.put("accessToken", newAccessToken);
            result.put("refreshToken", newRefreshToken);
        }

        return result;
    }

        private boolean checkTime(Integer exp) {
            java.util.Date expDate = new java.util.Date((long)exp*(1000));
            long timeGap = expDate.getTime() - System.currentTimeMillis();
            long remainTime = timeGap/(1000*60);
            return remainTime < 60;
        }

        private boolean checkExpiredToken(String accessToken) {
            try {
                JWTUtil.validateToken(accessToken);
            } catch (CustomJWTException e) {
                if(e.getMessage().equals("Expired")){
                    return false;
                }
            }
            return true;
        }

    @PostMapping("/checkId")
    public HashMap<String, Object> checkId(@RequestParam("memberId")String memberId){
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.getMember(memberId);
        if (member == null) {
            result.put("msg", "yes");
        }else{
            result.put("msg", "no");
        }
//        System.out.println(member);
        System.out.println(result);

        return result;
    }

    @Autowired
    ServletContext context;

    @PostMapping("/fileUp")
    public HashMap<String, Object> fileUp(@RequestParam("image") MultipartFile file) {
        HashMap<String, Object> result = new HashMap<>();

        // 프로젝트 디렉토리를 기준으로 profileImage 폴더 설정
        String uploadDir = System.getProperty("user.dir") + "/src/main/webapp/profileImage/";
        File directory = new File(uploadDir);

        // 폴더가 존재하지 않으면 생성
        if (!directory.exists()) {
            if (directory.mkdirs()) {
                System.out.println("폴더 생성 성공: " + uploadDir);
            } else {
                System.out.println("폴더 생성 실패");
                return result;
            }
        } else {
            System.out.println("폴더가 이미 존재");
        }

        // 파일명 설정 (UUID + 원본 확장자)
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".")); // 확장자 추출
        String newFilename = UUID.randomUUID().toString() + fileExtension; // 고유한 파일명 생성

        // 저장할 파일의 전체 경로
        String uploadPath = uploadDir + newFilename;

        try {
            // 파일 저장
            file.transferTo(new File(uploadPath));

            // 저장된 파일의 접근 가능한 URL 반환
            String image = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/profileImage/")
                    .path(newFilename)
                    .toUriString();

            result.put("image", newFilename);
            System.out.println(result);
            System.out.println("파일 저장 성공: " + uploadPath);
        } catch (IOException e) {
            System.out.println("파일 저장 실패: " + e.getMessage());
            result.put("error", "파일 저장 실패");
        }

        return result;
    }


    @PostMapping("/join")
    public HashMap<String, Object> join(@ModelAttribute Member member){
        HashMap<String, Object> result = new HashMap<>();
        ms.insertMember(member);
        result.put("msg", "yes");

        return result;
    }

    @Value("${kakao.client_id}")
    private String client_id;
    @Value("${kakao.redirect_uri}")
    private String redirect_uri;

    @GetMapping("/kakaoStart")
    public @ResponseBody String kakaoStart(){
        String a = "<script type='text/javascript'>"
                + "location.href='https://kauth.kakao.com/oauth/authorize?"
                + "client_id=" + client_id + "&"
                + "redirect_uri=" + redirect_uri + "&"
                + "response_type=code';" + "</script>";
        return a;
    }

    @RequestMapping("/kakaoLogin")
    public void kakaoLogin(HttpServletRequest request, HttpServletResponse response ) throws IOException, MalformedURLException {
        String code = request.getParameter("code");
        String endpoint = "https://kauth.kakao.com/oauth/token";
        URL url = new URL(endpoint);
        String bodyData = "grant_type=authorization_code&";
        bodyData += "client_id=" + client_id + "&";
        bodyData += "redirect_uri=" + redirect_uri + "&";
        bodyData += "code=" + code;

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        conn.setDoOutput(true);
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), "UTF-8"));
        bw.write(bodyData);
        bw.flush();
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        String input = "";
        StringBuilder sb = new StringBuilder();
        while ((input = br.readLine()) != null) {
            sb.append(input);
        }
        Gson gson = new Gson();
        OAuthToken oAuthToken = gson.fromJson(sb.toString(), OAuthToken.class);
        String endpoint2 = "https://kapi.kakao.com/v2/user/me";
        URL url2 = new URL(endpoint2);

        HttpsURLConnection conn2 = (HttpsURLConnection) url2.openConnection();
        conn2.setRequestProperty("Authorization", "Bearer " + oAuthToken.getAccess_token());
        conn2.setDoOutput(true);
        BufferedReader br2 = new BufferedReader(new InputStreamReader(conn2.getInputStream(), "UTF-8"));
        String input2 = "";
        StringBuilder sb2 = new StringBuilder();
        while ((input2 = br2.readLine()) != null) {
            sb2.append(input2);
            System.out.println(input2);
        }
        Gson gson2 = new Gson();
        KakaoProfile kakaoProfile = gson2.fromJson(sb2.toString(), KakaoProfile.class);
        KakaoProfile.KakaoAccount ac = kakaoProfile.getAccount();
        KakaoProfile.KakaoAccount.Profile pf = ac.getProfile();
        System.out.println("id : " + kakaoProfile.getId());
        System.out.println("KakaoAccount-Email : " + ac.getEmail());
        System.out.println("Profile-Nickname : " + pf.getNickname());

        Member member = ms.getMember( kakaoProfile.getId() );
        if( member == null ){
            member = new Member();
            member.setMemberId( kakaoProfile.getId() );
            member.setNickname( pf.getNickname() );
            member.setPassword( "kakao1234" );
            member.setProvider( "kakao" );
            ms.insertMember(member);
        }
        response.sendRedirect("http://13.209.123.104/KakaoLogin/"+member.getMemberId());
    }

    @GetMapping("/getMember")
    public HashMap<String, Object> getMember(@RequestParam("giftToId") String memberId){
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.getMember(memberId);
        if(member != null){
            result.put("message", "yes");
        }else{
            result.put("message", "no");
        }
        return result;
    }

    @PostMapping("/updateMember")
    public HashMap<String, Object> updateMember(@RequestBody Member member){
        HashMap<String, Object> result = new HashMap<>();
        Member updateMember = ms.updateMember(member);
        result.put("updateMember", updateMember);
        result.put("msg", "yes");
        return result;
    }

    @PostMapping("/updateRole")
    public ResponseEntity<?> updateRole(
            @RequestParam("memberId") String memberId,
            @RequestParam("role") RoleName role){
        boolean member = ms.updateMemberRole(memberId, role);
        return member ? ResponseEntity.ok("권한 변경 완료") : ResponseEntity.badRequest().body("권한 변경 실패");


    }



    @DeleteMapping("/deleteMember/{memberId}")
    public HashMap<String, Object> deleteMember(@PathVariable("memberId") String memberId){
        HashMap<String, Object> result = new HashMap<>();
        ms.deleteMember(memberId);
        result.put("msg", "yes");
        return result;
    }


    @GetMapping("/searchMember")
    public HashMap<String, Object> getSearchMember(@RequestParam("memberId")String memberId) {
        HashMap<String,Object> map=new HashMap<>();
        List<Member> members=ms.getSearchMember(memberId);
        map.put("member",members);
        return map;
    }

    @GetMapping("/findByMemberId")
    public HashMap<String, Object> getByMemberId(@RequestParam("memberId") String memberId) {
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.getMember(memberId);

        if (member != null) {
            result.put("msg", "yes");
            result.put("member", member);
        } else {
            result.put("msg", "no");
        }

        return result;
    }

    @PostMapping("/resetPassword")
    public HashMap<String, Object> resetPassword(@RequestParam("memberId")String memberId){
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.resetPassword(memberId);
        result.put("msg", "yes");
        return result;
    }



}









