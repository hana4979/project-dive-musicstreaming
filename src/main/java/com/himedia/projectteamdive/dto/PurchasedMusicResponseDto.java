package com.himedia.projectteamdive.dto;

import lombok.Getter;

@Getter
public class PurchasedMusicResponseDto {
    private int musicId;
    private String title;
    private String artist;
    private String image;

    public PurchasedMusicResponseDto(int musicId, String title, String artist, String image) {
        this.musicId = musicId;
        this.title = title;
        this.artist = artist;
        this.image = image;
    }
}
