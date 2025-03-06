package com.himedia.projectteamdive.dto;

import com.himedia.projectteamdive.entity.Member;
import com.himedia.projectteamdive.entity.MemberRecentMusics;
import com.himedia.projectteamdive.entity.Music;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
public class MemberRecentMusicsDto {
    private int id;
    private int musicId;
    private String title;
    private String artist;
    private String image;


    public MemberRecentMusicsDto(MemberRecentMusics recentMusics) {
        this.id = recentMusics.getId();
        this.musicId=recentMusics.getMusic().getMusicId();
        this.title = recentMusics.getMusic().getTitle();
        this.artist=recentMusics.getMusic().getArtist().getArtistName();
        this.image=recentMusics.getMusic().getAlbum().getImage();
    }
}
