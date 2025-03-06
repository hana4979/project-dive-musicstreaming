package com.himedia.projectteamdive.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
@DynamicUpdate
public class Music {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "music_id")
    private int musicId;
    private String title;
    @Column(name = "play_count")
    private int playCount=0;
//    @Column(name = "play_count_day")
//    private int playCountDay=0;
//    @Column(name = "play_count_week")
//    private int playCountWeek=0;
//    @Column(name = "play_count_month")
//    private int playCountMonth=0;
    private String genre;
    private String lyrics;
    @Column(name = "title_music")
    private boolean titleMusic =false;
    @Column(name ="track_number")
    private int trackNumber=0;
    @Column(name ="bucket_path")
    private String bucketPath;
    @Column(length = 1000)
    private String content;

    @ManyToOne
    @JoinColumn(name = "album_id")
    @JsonBackReference
    Album album;

    @ManyToOne
    @JoinColumn(name = "artist_id")
    Artist artist;

    @ManyToMany(mappedBy = "musicList")
    List<Playlist>playlists=new ArrayList<>();

    @PrePersist
    @PreUpdate
    public void syncArtistWithAlbum() {
        if (album != null) {
            this.artist = album.getArtist();  // 앨범의 아티스트를 자동으로 설정
        }
    }

    private String mood;



}
