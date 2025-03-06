package com.himedia.projectteamdive.controller;

import com.himedia.projectteamdive.dto.CartRequestDto;
import com.himedia.projectteamdive.dto.MusicDto;
import com.himedia.projectteamdive.dto.OrderMusicRequestDto;
import com.himedia.projectteamdive.dto.PurchasedMusicResponseDto;
import com.himedia.projectteamdive.entity.Cart;
import com.himedia.projectteamdive.entity.Music;
import com.himedia.projectteamdive.service.Mp3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/mp3")
public class Mp3Controller {
    @Autowired
    Mp3Service ms;

    /* 이미 구매한 곡이 있는지 확인 */
    @PostMapping("/checkPurchasedMusic")
    public HashMap<String, Object> getPurchasedMusic(
            @RequestBody List<Integer> musicIdList,
            @RequestParam("giftToId") String giftToId) {
        HashMap<String, Object> result = new HashMap<>();
        List<PurchasedMusicResponseDto> purchasedMusicList = ms.checkPurchasedMusic(musicIdList, giftToId);
        if(!purchasedMusicList.isEmpty()) {
            result.put("message", "yes");
            result.put("purchasedMusicList", purchasedMusicList);
        }else{
            result.put("message", "no");
        }
        return result;
    }

    /* 구매할 곡에 대한 정보 추출 */
    @PostMapping("/getPurchaseMusicList")
    public HashMap<String, Object> getPurchaseMusicList(@RequestBody List<Integer> musicIdList){
        HashMap<String, Object> result = new HashMap<>();
        List<MusicDto> purchaseMusicList = ms.getPurchaseMusicList(musicIdList);
        if(!purchaseMusicList.isEmpty()) {
            result.put("message", "yes");
            result.put("purchaseMusicList", purchaseMusicList);
        }else{
            result.put("message", "no");
        }
        return result;
    }

    /* 구매한 곡에 대한 정보 추출 */
    @GetMapping("/getPurchasedMusicList")
    public HashMap<String, Object> getPurchasedMusicList(@RequestParam("memberId") String memberId){
        HashMap<String, Object> result = new HashMap<>();
        List<PurchasedMusicResponseDto> purchasedMusicList = ms.getPurchasedMusicList(memberId);
        if(!purchasedMusicList.isEmpty()) {
            result.put("message", "yes");
            result.put("purchasedMusicList", purchasedMusicList);
        }else{
            result.put("message", "no");
        }
        return result;
    }

}
