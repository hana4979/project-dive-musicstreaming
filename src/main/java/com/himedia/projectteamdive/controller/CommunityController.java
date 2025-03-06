package com.himedia.projectteamdive.controller;

import com.himedia.projectteamdive.entity.Likes;
import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.entity.Reply;
import com.himedia.projectteamdive.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/api/community")
public class CommunityController {
    @Autowired
    CommunityService cs;

    @PostMapping("/insertReply")
    public HashMap<String,Object> insertReply(@RequestBody Reply reply, @RequestParam("pagetype")String type,@RequestParam("entityId")int entityId,@RequestParam("memberId")String memberId) {
        HashMap<String,Object> map = new HashMap<>();
        cs.insertReply(reply,type,entityId,memberId);
        map.put("msg","yes");
        return map;
    }

    @DeleteMapping("/deleteReply/{replyId}")
    public HashMap<String,Object> deleteReply(@PathVariable("replyId")int replyId) {
        HashMap<String,Object> map = new HashMap<>();
        cs.deleteReply(replyId);
        map.put("msg","yes");
        return map;
    }

    @PostMapping("/insertLikes")
    public HashMap<String,Object> insertLikes(@RequestParam("memberId")String memberId,
                                              @RequestParam("pagetype")String type,@RequestParam("entityId")int entityId) {
        HashMap<String,Object> map = new HashMap<>();
        cs.insertLikes(memberId,type,entityId);
        map.put("msg","yes");
        return map;
    }

    @GetMapping("/getReplyList")
    public HashMap<String,Object> getReply(@RequestParam("pagetype")String type,@RequestParam("entityId")int entityId) {
        HashMap<String,Object> map = new HashMap<>();
        map.put("replyList",cs.getReply(type,entityId));
        return map;
    }

    @GetMapping("/getLikes")
    public HashMap<String,Object> getLikes(
            @RequestParam("pagetype")String type,
            @RequestParam("memberId")String memberId
    ) {
        HashMap<String,Object> map = new HashMap<>();
        map.put("likesList",cs.getLikes(type,memberId));
        return map;
    }

    @GetMapping("/getReplyListUser")
    public HashMap<String, Object> getReplyList(
            @RequestParam("pageType")String pageType,
            @RequestParam("memberId")String memberId){
        HashMap<String,Object> map = new HashMap<>();

        map.put("replyList", cs.getReplyList(pageType, memberId));

        return map;
    }

    /* 좋아요 총 개수 조회 */
    @GetMapping("/getLikeCount")
    public HashMap<String,Object> getLikeCount(
            @RequestParam("pageType") String pageType,
            @RequestParam("entityId") int entityId){
        HashMap<String,Object> result = new HashMap<>();
        result.put("likeCount", cs.getLikeCount(pageType, entityId));
        return result;
    }

    @GetMapping("/getNoticeList")
    public HashMap<String, Object> getNoticeList(){
        HashMap<String,Object> map = new HashMap<>();
        map.put("noticeList", cs.getNoticeList());
        return map;
    }


}
