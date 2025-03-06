package com.himedia.projectteamdive.service;

import com.himedia.projectteamdive.dto.MusicDto;
import com.himedia.projectteamdive.dto.OrderMusicRequestDto;
import com.himedia.projectteamdive.dto.PurchasedMusicResponseDto;
import com.himedia.projectteamdive.entity.*;
import com.himedia.projectteamdive.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class Mp3Service {
    @Autowired
    PurchasedMusicRepository purchasedMusicRepo;
    @Autowired
    MemberRepository memberRepo;
    @Autowired
    MusicRepository musicRepo;

    /* 이미 구매한 곡이 있는지 확인 */
    public List<PurchasedMusicResponseDto> checkPurchasedMusic(
            List<Integer> musicIdList, String giftToId) {
        // 선물 받을 회원 조회
        Member member = memberRepo.findByMemberId(giftToId);
        // 해당 회원이 구매한 곡 리스트 조회
        List<PurchasedMusicResponseDto> purchasedMusicList = purchasedMusicRepo.findByMember(member);
        // 구매한 곡이 담길 리스트
        List<PurchasedMusicResponseDto> matchedMusicList = new ArrayList<>();

        // cartList에서 각각의 곡을 순회하면서 구매한 곡과 비교
        musicIdList.forEach(musicId -> {
            // purchasedMusicList에서 해당 음악이 이미 구매된 곡인지 확인
            purchasedMusicList.forEach(purchasedMusic -> {
                if (purchasedMusic.getMusicId() == musicId) {
                    matchedMusicList.add(purchasedMusic);  // 일치하는 곡을 matchedMusicList에 추가
                }
            });
        });

        // 결과 반환
        return matchedMusicList;
    }

    /* 구매할 곡에 대한 정보 추출 */
    public List<MusicDto> getPurchaseMusicList(List<Integer> musicIdList) {
        List<MusicDto> musicList = new ArrayList<>();
        for (Integer musicId : musicIdList) {
            musicList.add(new MusicDto(musicRepo.findByMusicId(musicId)));
        }
        return musicList;
    }

    /* 구매한 곡에 대한 정보 추출 */
    public List<PurchasedMusicResponseDto> getPurchasedMusicList(String memberId) {
        // 로그인 회원 조회
        Member member = memberRepo.findByMemberId(memberId);
        // 해당 회원이 구매한 곡 리스트 조회
        return purchasedMusicRepo.findByMember(member);
    }
}
