package com.himedia.projectteamdive.dto;

import com.himedia.projectteamdive.entity.Album;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlbumDto {
    private int albumId;
    private String title;
    private String image;
    private String content;
    private Timestamp indate;
    private List<MusicDto> musicList;  // 음악 리스트
    private int artistId;
    private String artistName;

    // Album -> AlbumDTO 변환
    public AlbumDto(Album album) {
        this.albumId = album.getAlbumId();
        this.title = album.getTitle();
        this.image = album.getImage();
        this.indate = album.getIndate();
        this.content = album.getContent();
        // 음악 리스트를 MusicDTO로 변환
        this.musicList = album.getMusicList().stream()
                .map(MusicDto::new)  // MusicDTO는 별도로 만들어야 함
                .collect(Collectors.toList());
        this.artistId=album.getArtist().getArtistId();
        this.artistName=album.getArtist().getArtistName();
    }
}
