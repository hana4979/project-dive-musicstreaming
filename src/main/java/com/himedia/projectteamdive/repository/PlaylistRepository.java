package com.himedia.projectteamdive.repository;

import com.himedia.projectteamdive.dto.AlbumDto;
import com.himedia.projectteamdive.dto.PlaylistDto;
import com.himedia.projectteamdive.entity.Pagetype;
import com.himedia.projectteamdive.entity.Playlist;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, Integer> {
    List<PlaylistDto> findByTitleContainingIgnoreCase(String title);

    List<PlaylistDto> findAllByMember_MemberId(String memberMemberId);

    Playlist findByPlaylistId(int playlistId);

    @Query("SELECT p.playlistId FROM Playlist p WHERE p.shayringyn = true ORDER BY p.indate DESC")
    List<Integer> getLatestPlayListIds(Pageable pageable);

    @Query("SELECT p FROM Playlist p WHERE p.playlistId IN :latestPlayListIds")
    List<Playlist> getPlaylistByIds(List<Integer> latestPlayListIds);


    @Query("SELECT p FROM Playlist p " +
            "JOIN Allpage a ON a.entityId = p.playlistId " +
            "LEFT JOIN Likes l ON l.allpage = a " +
            "WHERE :playlistType MEMBER OF a.pagetype " +
            "GROUP BY p " +
            "ORDER BY COUNT(l) DESC")
    List<Playlist> findHotPlaylists(@Param("playlistType") Pagetype playlistType);


//    @Query("SELECT p FROM Playlist p WHERE p.playlistId = :")
//    PlaylistDto findByPlaylistId2(int playlistId);
}
