package com.himedia.projectteamdive.controller;

import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.service.MailService;
import com.himedia.projectteamdive.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MailController {

    private final MailService ms;
    private String authKey;

    @PostMapping("/sendMail")
    public HashMap<String, Object> sendMail(@RequestParam("email") String email) {
        HashMap<String, Object> result = new HashMap<>();

        authKey = ms.sendMail(email);
        System.out.println("authKey:" + authKey);
        result.put("msg", "yes");

        return result;
    }

    @PostMapping("/emailCheck")
    public HashMap<String, Object> emailCheck(@RequestParam("emailCheckCode") String emailCheckCode) {
        HashMap<String, Object> result = new HashMap<>();
        if(authKey.equals(emailCheckCode)) {
            result.put("msg", "yes");
        }else{
            result.put("msg", "no");
        }
        return result;
    }

    @Autowired
    MemberService mbs;

    @GetMapping("/emailCheckForPassword")
    public HashMap<String, Object> emailCheckForPassword(
            @RequestParam("memberId") String memberId,
            @RequestParam("email") String email){
        HashMap<String, Object> result = new HashMap<>();
        Member member = mbs.getMember(memberId);
        if(!member.getEmail().equals(email)){
            result.put("msg", "no");
        }else{
            result.put("msg", "yes");
        }
        return result;
    }

    private String temporaryPassword;

    @PostMapping("/sendEmailForPassword")
    public HashMap<String, Object> sendEmailForPassword(
            @RequestParam("memberId")String memberId,
            @RequestParam("email")String email){
        HashMap<String, Object> result = new HashMap<>();

        System.out.println("mail memberId:" + memberId);
        System.out.println("mail email:" + email);
        try{
            temporaryPassword = ms.sendMailForPassword(memberId, email);
            System.out.println("temporaryPassword:" + temporaryPassword);
            result.put("msg", "yes");
        }catch(Exception e){
            e.printStackTrace(); // 예외 로그 출력
            result.put("msg", "error");
            result.put("error", e.getMessage());
        }
        return result;
    }


}
