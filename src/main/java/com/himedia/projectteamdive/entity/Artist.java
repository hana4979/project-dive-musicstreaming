package com.himedia.projectteamdive.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Builder
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
@DynamicUpdate
public class Artist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "artist_id")
    private int artistId;
    @Column(name = "artist_name")
    private String artistName;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp debut;
    private String country;
    private String image;
    @Column(length = 1000)
    private String content;

    @OneToMany(mappedBy = "artist",  cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    @Builder.Default
    List<Album> albums=new ArrayList<>();

    // 앨범 추가 메서드
    public void addAlbum(Album album) {
        albums.add(album);
        album.setArtist(this);
    }

    // 앨범 삭제 메서드
    public void removeAlbum(Album album) {
        albums.remove(album); // 리스트에서 제거
    }

    @OneToMany(mappedBy = "artist", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    @Builder.Default
    List<Music> musicList=new ArrayList<>();

    public void addMusic(Music music) {
        musicList.add(music);
        music.setArtist(this);
    }
    public void removeMusic(Music music) {
        musicList.remove(music);
    }




}
