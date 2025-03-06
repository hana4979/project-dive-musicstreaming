package com.himedia.projectteamdive.repository;

import com.himedia.projectteamdive.dto.MusicChartDto;
import com.himedia.projectteamdive.entity.Music;
import com.himedia.projectteamdive.entity.Playcountlist;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface PlaycountlistRepository  extends JpaRepository<Playcountlist, Integer> {



    @Query("select new com.himedia.projectteamdive.dto.MusicChartDto(p.music, sum(p.playCount)) from Playcountlist p where p.indate >= :thirtyDaysAgo group by p.music order by sum(p.playCount) desc ")
    List<MusicChartDto> findTop100ByMusicChart(Timestamp thirtyDaysAgo, Pageable pageable);

    @Query("select new com.himedia.projectteamdive.dto.MusicChartDto(p.music, sum(p.playCount)) from Playcountlist p where p.indate >= :chartDays group by p.music order by sum(p.playCount) desc")
    List<MusicChartDto> findTop100ByMusicWeekCart(Timestamp chartDays, Pageable pageable);

    @Query("select new com.himedia.projectteamdive.dto.MusicChartDto(p.music, sum(p.playCount)) from Playcountlist p where p.indate >= :chartDays and p.music.artist.country='korea' group by p.music order by sum(p.playCount) desc")
    List<MusicChartDto> findTop100ByMusicChartKor(Timestamp chartDays, Pageable pageable);

    @Query("select new com.himedia.projectteamdive.dto.MusicChartDto(p.music, sum(p.playCount)) from Playcountlist p where p.indate >= :chartDays and p.music.artist.country<>'korea' group by p.music order by sum(p.playCount) desc")
    List<MusicChartDto> findTop100ByMusicChartnoKor(Timestamp chartDays, Pageable pageable);

    List<Playcountlist> findAllByIndateBefore(LocalDateTime thirtyDaysAgo);

    Playcountlist findByMusicAndMemberIdAndIndate(Music music, String memberId, Timestamp indate);

    @Query("select new com.himedia.projectteamdive.dto.MusicChartDto(p.music, sum(p.playCount)) from Playcountlist p where p.indate >= :chartDays group by p.music order by sum(p.playCount) desc")
    List<MusicChartDto> findTop100ByMusictoday(Timestamp chartDays, Pageable pageable);
}
