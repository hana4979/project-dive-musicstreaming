package com.himedia.projectteamdive.controller;

import com.himedia.projectteamdive.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/member")
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


}
