package com.himedia.projectteamdive.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
@DynamicUpdate
public class Playcountlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "music_id", nullable = false)
    private Music music;
    @Column(name = "member_id")
    private String memberId;


    @Column(nullable = false)
    private Timestamp indate;  // 재생된 시간

    @Column(nullable = false)
    private Integer playCount=0;  // 음악이 재생된 횟수

    public Playcountlist(Music music,String memberId, Timestamp indate, int playCount) {
        this.music = music;
        this.memberId = memberId;
        this.indate = indate;
        this.playCount = playCount;
    }
    @PrePersist
    public void prePersist() {
        if (this.indate != null) {
            // Timestamp를 LocalDateTime으로 변환 후 시간 00:00으로 설정
            LocalDateTime midnightLocalDateTime = indate.toLocalDateTime().toLocalDate().atStartOfDay();
            // 다시 Timestamp로 변환
            Timestamp midnightTimestamp = Timestamp.valueOf(midnightLocalDateTime);
            // 00:00으로 설정된 Timestamp 저장
            this.indate = midnightTimestamp;
        }
    }
}
