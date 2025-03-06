package com.himedia.projectteamdive.dto;

import lombok.Getter;

@Getter
public class RecommendationScore {
    private final int emotionScore; // 감정 추천 점수
    private final int similarScore; // 유사 감정 추천 점수
    //private final int popularScore; // 인기 음악 추천 점수
    private final int randomScore; // 랜덤 추천 점수
    private final int recentMusicScore; // 사용자가 최근에 들은 음악 추천 점수

    public RecommendationScore(int emotionScore, int similarScore, int recentMusicScore, int randomScore) {
        this.emotionScore = emotionScore;
        this.similarScore = similarScore;
        this.recentMusicScore = recentMusicScore;
        this.randomScore = randomScore;
    }

    public int getTotalLimit() {
        return 200;
    }
}