package com.himedia.projectteamdive.dto;

import com.himedia.projectteamdive.entity.Music;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MusicDto {
    private int musicId;
    private String title;
    private int playCount;
    private String mood;
    private String genre;
    private String lyrics;
    private boolean titleMusic;
    private int trackNumber;
    private String bucketPath;
    private String content;
    private int artistId;
    private String artistName;
    private int albumId;
    private String albumTitle;
    private String image;
    private Timestamp albumIndate;

    // Music -> MusicDTO 변환
    public MusicDto(Music music) {
        if (music == null) {
            throw new IllegalArgumentException("Music entity cannot be null");
        }
        this.musicId = music.getMusicId();
        this.title = music.getTitle();
        this.playCount = music.getPlayCount();
        this.mood = music.getMood();
        this.genre = music.getGenre();
        this.lyrics = music.getLyrics();
        this.titleMusic = music.isTitleMusic();
        this.trackNumber = music.getTrackNumber();
        this.bucketPath = music.getBucketPath();
        this.content = music.getContent();
        this.artistId= music.getArtist().getArtistId();
        this.artistName = music.getArtist().getArtistName();
        this.albumId = music.getAlbum().getAlbumId();
        this.albumTitle = music.getAlbum().getTitle();
        this.image = music.getAlbum().getImage();
        this.albumIndate=music.getAlbum().getIndate();
    }

    // 추천 알고리즘시 새로 곡의 중복 추천방지하기위함
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        MusicDto music = (MusicDto) obj;
        return musicId == music.musicId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(musicId);
    }





}