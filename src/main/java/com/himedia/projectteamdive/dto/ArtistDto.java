package com.himedia.projectteamdive.dto;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.himedia.projectteamdive.entity.Album;
import com.himedia.projectteamdive.entity.Artist;
import com.himedia.projectteamdive.entity.Music;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArtistDto {

    private int artistId;
    private String artistName;
    private Timestamp debut;
    private String country;
    private String image;
    private String content;
    private List<AlbumDto> albums;  // 앨범 정보
    private List<MusicDto> musicList;  // 음악 정보

    // Artist -> ArtistDTO 변환
    public ArtistDto(Artist artist) {
        this.artistId = artist.getArtistId();
        this.artistName = artist.getArtistName();
        this.debut = artist.getDebut();
        this.country = artist.getCountry();
        this.image = artist.getImage();
        this.content = artist.getContent();
        // 앨범과 음악 리스트는 DTO로 변환
        this.albums = artist.getAlbums().stream().map(AlbumDto::new).collect(Collectors.toList());
        this.musicList = artist.getMusicList().stream().map(MusicDto::new).collect(Collectors.toList());
    }
}
