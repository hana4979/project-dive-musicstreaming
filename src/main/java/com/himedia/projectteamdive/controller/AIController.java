package com.himedia.projectteamdive.controller;

import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.service.AIService;
import com.himedia.projectteamdive.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/api/AI")
public class AIController {

    @Autowired
    AIService AIs;
    @Autowired
    MemberService ms;

    @GetMapping("/recommendList")
    public HashMap<String, Object>recommendList(
            @RequestParam("mood")String mood,
            @RequestParam("memberId")String memberId,
            @RequestParam(value = "signal", required = false)Boolean signal){
        HashMap<String, Object> result = new HashMap<>();
        if(signal == false || signal == null || signal.equals("")){
            result.put("recommendList", AIs.getRecommend(mood, memberId, signal));
        }
        return result;
    }

    @GetMapping("/addRecommendList")
    public HashMap<String, Object>addRecommendList(
            @RequestParam("mood")String mood,
            @RequestParam("memberId")String memberId,
            @RequestParam(value = "signal", required = false)Boolean signal){ // 자료형은 추후에 변경
        HashMap<String, Object> result = new HashMap<>();
        if(signal == false){    // 추가되지 말아야 할 시그널을 보내준다면
            result.put("addRecommendList", null);
        }else{              // 추가되어야 할 시그널을 보내준다면
            System.out.println("mood  "+ mood);
            System.out.println("signal  "+ signal);
            result.put("addRecommendList", AIs.getRecommend(mood, memberId, signal));
        }
        return result;
    }



}
