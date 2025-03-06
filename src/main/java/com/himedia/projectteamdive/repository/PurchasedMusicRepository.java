package com.himedia.projectteamdive.repository;

import com.himedia.projectteamdive.dto.PurchasedMusicResponseDto;
import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.entity.PurchasedMusic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchasedMusicRepository extends JpaRepository<PurchasedMusic, Integer> {

    @Query("SELECT new com.himedia.projectteamdive.dto.PurchasedMusicResponseDto(pm.music.musicId, pm.music.title, pm.music.artist.artistName, pm.music.album.image) " +
            "FROM PurchasedMusic pm WHERE pm.member = :member")
    List<PurchasedMusicResponseDto> findByMember(@Param("member") Member member);
}
