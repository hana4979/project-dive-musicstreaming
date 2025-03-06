package com.himedia.projectteamdive.security.filter;

import com.google.gson.Gson;
import com.himedia.projectteamdive.dto.MemberDto;
import com.himedia.projectteamdive.security.util.CustomJWTException;
import com.himedia.projectteamdive.security.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

public class JWTCheckFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        try {
            String accsessToken= authHeader.substring(7);
            Map<String,Object>claims= JWTUtil.validateToken(accsessToken);
            System.out.println("JWT claims: "+claims);

            String memberId= (String) claims.get("memberId");
            String password= (String) claims.get("password");
            String name= (String) claims.get("name");
            String nickname= (String) claims.get("nickname");
            String phone= (String) claims.get("phone");
            String email= (String) claims.get("email");
            String gender= (String) claims.get("gender");
            String birth= (String) claims.get("birth");
            String address= (String) claims.get("address");
            String addressDetail= (String) claims.get("addressDetail");
            String addressExtra= (String) claims.get("addressExtra");
            Integer zipCode= (Integer) claims.get("zipCode");
            String image= (String) claims.get("image");
            String provider= (String) claims.get("provider");
            String memberKey= (String) claims.get("memberKey");
            String introduction= (String) claims.get("introduction");
            List<String>memberRoleList= (List<String>) claims.get("memberRoleList");
            MemberDto memberDto=new MemberDto(memberId,password,name,nickname,phone,email,gender,birth,zipCode,address,addressDetail,addressExtra,image,provider,memberKey,introduction,memberRoleList);


            UsernamePasswordAuthenticationToken authenticationToken= new UsernamePasswordAuthenticationToken(memberDto,password,memberDto.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            filterChain.doFilter(request, response);

        }catch (Exception | CustomJWTException e){
            System.out.println("JWT Check Error..............");
            System.out.println(e.getMessage());
            Gson gson = new Gson();
            String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));
            response.setContentType("application/json");
            PrintWriter printWriter = response.getWriter();
            printWriter.println(msg);
            printWriter.close();
        }




    }
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path=request.getRequestURI();
        System.out.println("check uri: "+path);

        if(request.getMethod().equals("OPTIONS")){
            return true;
        }

        if(path.startsWith("/api/member/login")){
            return true;
        }
        if(path.startsWith("/api/membership/getMembership")){
            return true;
        }
        if(path.startsWith("/api/member/checkId")){
            return true;
        }
        if(path.startsWith("/api/member/join")){
            return true;
        }
        if(path.startsWith("/api/member/kakaoStart")){
            return true;
        }
        if(path.startsWith("/api/member/kakaoLogin")){
            return true;
        }
        if(path.startsWith("/api/member/sendMail")){
            return true;
        }
        if(path.startsWith("/api/member/emailCheck")){
            return true;
        }
        if(path.startsWith("/api/chat/ask")){
            return true;
        }
        if(path.startsWith("/api/music/addPlayCount")){
            return true;
        }
        if(path.startsWith("/api/music/getMusicChart")){
            return true;
        }
        if(path.startsWith("/api/music/getAlbumChart")){
            return true;
        }
        if(path.startsWith("/api/music/getArtist")){
            return true;
        }
        if(path.startsWith("/api/music/getAlbum")){
            return true;
        }
        if(path.startsWith("/api/music/getMusic")){
            return true;
        }
        if(path.startsWith("/api/music/playlistDetail")){
            return true;
        }
        if(path.startsWith("/api/music/getSearch")){
            return true;
        }
        if(path.startsWith("/api/music/getCurrentPlaylist")){
            return true;
        }
        if(path.startsWith("/api/music/getMemberPlaylist")){
            return true;
        }
        if(path.startsWith("/api/music/getMemberRecentMusics")){
            return true;
        }
        if(path.startsWith("/api/community/getLikeCount")){
            return true;
        }
        if(path.startsWith("/api/community/insertReply")){
            return true;
        }
        if(path.startsWith("/api/community/getReplyList")){
            return true;
        }
        if(path.startsWith("/api/membership/getMembershipByCategory")){
            return true;
        }
        //======추가된것
        if(path.startsWith("/api/member/refresh")){
            return true;
        }
        if(path.startsWith("/api/AI/recommendList")){
            return true;
        }
        if(path.startsWith("/api/music/latestPlayList")){
            return true;
        }
        if(path.startsWith("/api/music/latestAlbumList")){
            return true;
        }
        if(path.startsWith("/api/music/latestMusicList")){
            return true;
        }
        if(path.startsWith("/api/community/getNoticeList")){
            return true;
        }
        if(path.startsWith("/api/membership/checkActiveMembership")){
            return true;
        }
        if(path.startsWith("/api/AI/addRecommendList")){
            return true;
        }
        if(path.startsWith("/api/music/getPlaylistPage")){
            return true;
        }
        if(path.startsWith("/api/member/findByMemberId")){
            return true;
        }
        if(path.startsWith("/api/member/resetPassword")){
            return true;
        }
        if(path.startsWith("/api/member/emailCheck")){
            return true;
        }
        if(path.startsWith("/api/member/sendEmailForPassword")){
            return true;
        }

//=========================================================================================

        if(path.startsWith("/member/login")){
            return true;
        }
        if(path.startsWith("/membership/getMembership")){
            return true;
        }
        if(path.startsWith("/member/checkId")){
            return true;
        }
        if(path.startsWith("/member/join")){
            return true;
        }
        if(path.startsWith("/member/kakaoStart")){
            return true;
        }
        if(path.startsWith("/member/kakaoLogin")){
            return true;
        }
        if(path.startsWith("/member/sendMail")){
            return true;
        }
        if(path.startsWith("/member/emailCheck")){
            return true;
        }
        if(path.startsWith("/chat/ask")){
            return true;
        }
        if(path.startsWith("/music/addPlayCount")){
            return true;
        }
        if(path.startsWith("/music/getMusicChart")){
            return true;
        }
        if(path.startsWith("/music/getAlbumChart")){
            return true;
        }
        if(path.startsWith("/music/getArtist")){
            return true;
        }
        if(path.startsWith("/music/getAlbum")){
            return true;
        }
        if(path.startsWith("/music/getMusic")){
            return true;
        }
        if(path.startsWith("/music/getSearch")){
            return true;
        }
        if(path.startsWith("/music/getCurrentPlaylist")){
            return true;
        }
        if(path.startsWith("/music/getMemberPlaylist")){
            return true;
        }
        if(path.startsWith("/music/getMemberRecentMusics")){
            return true;
        }
        if(path.startsWith("/community/getLikeCount")){
            return true;
        }
        if(path.startsWith("/community/insertReply")){
            return true;
        }
        if(path.startsWith("/community/getReplyList")){
            return true;
        }
        if(path.startsWith("/membership/getMembershipByCategory")){
            return true;
        }
        //======추가된것
        if(path.startsWith("/member/refresh")){
            return true;
        }
        if(path.startsWith("/AI/recommendList")){
            return true;
        }
        if(path.startsWith("/AI/addRecommendList")){
            return true;
        }
        if(path.startsWith("/music/latestPlayList")){
            return true;
        }
        if(path.startsWith("/music/latestAlbumList")){
            return true;
        }
        if(path.startsWith("/music/latestMusicList")){
            return true;
        }
        if(path.startsWith("/community/getNoticeList")){
            return true;
        }
        if(path.startsWith("/membership/checkActiveMembership")){
            return true;
        }
        if(path.startsWith("/AI/addRecommendList")){
            return true;
        }

        // 비밀번호 변경을위한 추가사항
        if(path.startsWith("/member/findByMemberId")){
            return true;
        }
        if(path.startsWith("/member/resetPassword")){
            return true;
        }
        if(path.startsWith("/member/emailCheck")){
            return true;
        }
        if(path.startsWith("/member/sendEmailForPassword")){
            return true;
        }















//        if(path.startsWith("/music/getPlaylistPage")){
//            return true;
//        }


        return false;
    }

}
