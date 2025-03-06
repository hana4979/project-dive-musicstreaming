package com.himedia.projectteamdive.controller;

import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.entity.Membership;
import com.himedia.projectteamdive.entity.Membership_user;
import com.himedia.projectteamdive.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/membership")
public class MembershipController {

    @Autowired
    MembershipService mss;

    /* 카테고리에 해당하는 멤버십 정보 가져오기 */
    @GetMapping("/getMembershipByCategory")
    public HashMap<String, Object> getMembershipByCategory(
            @RequestParam("category") String category) {
        HashMap<String, Object> result = new HashMap<>();
        result.put("membershipList", mss.getMembershipByCategory(category));
        return result;
    }

    /* 카테고리 기준으로 활성화된 멤버십이 있는지 확인 */
    @GetMapping("/checkActiveMembership")
    public HashMap<String, Object> checkActiveMembership(
            @RequestParam("memberId") String memberId,
            @RequestParam("category") String membershipCategory) {
        HashMap<String, Object> result = new HashMap<>();
        Membership_user activeMembership = mss.checkActiveMembership(memberId, membershipCategory);
        if(activeMembership != null) {
            result.put("message", "yes");
            result.put("activeMembership", activeMembership);
        }else{
            result.put("message", "no");
        }
        return result;
    }

    /* 로그인 유저의 활성화 멤버십 확인 */
    @GetMapping("/getActiveMembership")
    public HashMap<String, Object> getActiveMembership(
            @RequestParam("memberId") String memberId) {
        HashMap<String, Object> result = new HashMap<>();
        List<Membership_user>list = mss.getActiveMembership(memberId);
        result.put("memberShipUserList", list);
        return result;
    }

    /* 선물 리스트 출력 */
    @GetMapping("/getGiftList")
    public HashMap<String, Object> getGiftList(@RequestParam("giftTo") String giftTo){
        HashMap<String, Object> result = new HashMap<>();
        result.put("giftList", mss.getGiftList(giftTo));
        return result;
    }

    /* 멤버십 활성화 */
    @PostMapping("/membershipActivate")
    public HashMap<String, Object> membershipActivate(
            @RequestParam("giftId") int giftId,
            @RequestParam("membershipCategory") String membershipCategory) {
        HashMap<String, Object> result = new HashMap<>();
        Boolean isActive = mss.membershipActive(giftId, membershipCategory);

        if(isActive) {
            result.put("message", "yes");
        }else{
            result.put("message", "no");
        }
        return result;
    }

    /* 멤버십 정보 전부 가져오기 */
    @GetMapping("/getMembership")
    public HashMap<String, Object> getMembership() {
        HashMap<String, Object> result = new HashMap<>();
        result.put("membershipList", mss.getMembership());
        return result;
    }

    /* 멤버십 세부 정보 불러오기 */
    @GetMapping("/getMembershipById")
    public HashMap<String, Object> getMembershipById(@RequestParam("membershipId") int membershipId) {
        HashMap<String, Object> result = new HashMap<>();
        result.put("membership", mss.getMembershipById(membershipId));
        return result;
    }

    /* 멤버십 추가 */
    @PostMapping("/insertMembership")
    public HashMap<String, Object> insertMembership(@RequestBody Membership membership) {
        HashMap<String, Object> result = new HashMap<>();
        mss.insertMembership(membership);
        result.put("message", "yes");
        return result;
    }

    /* 멤버십 수정 */
    @PostMapping("/updateMembership")
    public HashMap<String, Object> updateMembership(@RequestBody Membership membership) {
        HashMap<String, Object> result = new HashMap<>();
        Membership updatedMembership = mss.updateMembership(membership);
        result.put("updatedMembership", updatedMembership);
        result.put("message", "yes");
        return result;
    }

    /* 멤버십 삭제 */
    @DeleteMapping("/deleteMembership/{membershipId}")
    public HashMap<String, Object> deleteMembership(@PathVariable("membershipId") int membershipId){
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("membershipId"+membershipId);
        mss.deleteMembership(membershipId);
        result.put("message", "yes");
        return result;
    }

    /* 멤버십 활성화 / 비활성화 설정 */
    @PutMapping("/toggleMembershipActive/{membershipId}")
    public HashMap<String, Object> toggleMembershipActive(@PathVariable("membershipId") int membershipId) {
        HashMap<String, Object> result = new HashMap<>();
        boolean success = mss.toggleMembershipActive(membershipId);
        result.put("message", success ? "yes" : "no");
        return result;
    }

}
