package com.himedia.projectteamdive.repository;

import com.himedia.projectteamdive.dto.MemberRecentMusicsDto;
import com.himedia.projectteamdive.dto.MusicDto;
import com.himedia.projectteamdive.entity.Music;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface MusicRepository extends JpaRepository<Music, Integer> {

    Music findByMusicId(int musicId);

    List<MusicDto> findByTitleContainingIgnoreCase(String title);

    List<MusicDto> findByLyricsContainingIgnoreCase(String lyrics);

    List<Music> findByMoodContaining(String mood);

    @Query("SELECT m FROM Music m WHERE m.mood = :mood AND m.genre IN :genres")
    List<MusicDto> getMusicByMoodAndGenre(@Param("mood") String mood, @Param("genres") List<String> genres, Pageable pageable);

    @Query("SELECT m FROM Music m WHERE m.mood IN :moods AND m.genre IN :genres")
    List<MusicDto> getMusicBySimilarMoodsAndGenre(@Param("moods") List<String> moods, @Param("genres") List<String> genres, Pageable pageable);

    @Query("SELECT m FROM Music m JOIN Playcountlist p ON m.musicId = p.music.musicId GROUP BY m.musicId ORDER BY SUM(p.playCount) DESC")
    List<MusicDto> getPopularMusic(Pageable pageable);

    @Query("SELECT m FROM Music m ORDER BY function('RAND')")
    List<MusicDto> getRandomMusic(Pageable pageable);

    @Query("SELECT m FROM Music m WHERE m.musicId IN :musicId")
    List<MusicDto> getMusicByIds(@Param("musicId") List<Integer> musicId);


    @Query("SELECT m.musicId FROM Music m " +
            "WHERE m.album IN (SELECT a FROM Album a ORDER BY a.indate DESC) ")
    List<Integer> getLatestMusicIds(Pageable pageable);

    List<Music> findByMood(String mood);




//    @Query("SELECT m FROM Music m WHERE m.musicId IN :ids ORDER BY m.tracknumber ASC")
//    List<Music> findAllByMusicId(@Param("ids") List<Integer> ids);


//    @Modifying
//    @Query("update Music m set m.playCountDay=0")
//    void resetPlayCountDay();
//
//    @Modifying
//    @Query("update Music m set m.playCountWeek=0")
//    void resetPlayCountWeek();
//
//    @Modifying
//    @Query("update Music m set m.playCountMonth=0")
//    void resetPlayCountMonth();

}
