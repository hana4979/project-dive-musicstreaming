package com.himedia.projectteamdive.repository;

import com.himedia.projectteamdive.dto.MemberRecentMusicsDto;
import com.himedia.projectteamdive.entity.MemberRecentMusics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MemberRecentMusicsRepository extends JpaRepository<MemberRecentMusics, Integer> {

    List<MemberRecentMusics> findByMember_MemberIdOrderByIdAsc(String memberMemberId);

    @Query("SELECT new com.himedia.projectteamdive.dto.MemberRecentMusicsDto(mr) " +
            "FROM MemberRecentMusics mr " +
            "JOIN mr.music m " +
            "JOIN mr.member mem " +
            "WHERE mem.memberId = :memberId order by mr.id desc ")
    List<MemberRecentMusicsDto> findByMember_MemberId(String memberId);

    // 유저의 최근 플레이 리스트에서 음원 추천해주는 쿼리
    @Query("SELECT mr.music.musicId FROM MemberRecentMusics mr " +
            "WHERE mr.member.memberId = :memberId " +
            "ORDER BY mr.id DESC LIMIT :limit")
    List<Integer> getRecentMusicIdsByMemberId(@Param("memberId") String memberId,
                                              @Param("limit") int limit);

}
