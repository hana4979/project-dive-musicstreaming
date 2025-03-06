package com.himedia.projectteamdive.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.himedia.projectteamdive.repository.MusicRepository;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
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
public class Album {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "album_id")
    private int albumId;
    private String title;
    private String image;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Timestamp indate;
    @Column(length = 1000)
    private String content;

    @ManyToOne
    @JoinColumn(name = "artist_id")
    Artist artist;

    @OneToMany(mappedBy = "album",cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @OrderBy("trackNumber ASC")
    @Builder.Default
    List<Music> musicList =new ArrayList<>();

    // 음악 추가 메서드
    public void addAlbum(Music music) {
        musicList.add(music);
        music.setTrackNumber(musicList.size());
        music.setAlbum(this);
    }

    // 음악 삭제 메서드 (삭제 후 orderIndex 재정렬)
    public void removeAlbum(Music music) {
        if (musicList.remove(music)) { //  리스트에서 음악 제거 성공 시
            music.setAlbum(null); //  연관 관계 해제
            reorderMusicList();  //  남은 곡들의 orderIndex 재정렬
        }
    }

    //  orderIndex 재정렬 메서드
    public void reorderMusicList() {
        for (int i = 0; i < musicList.size(); i++) {
            musicList.get(i).setTrackNumber(i);  //  0부터 차례로 재정렬
        }
    }
}
