package com.himedia.projectteamdive.service;

import com.himedia.projectteamdive.dto.MusicDto;
import com.himedia.projectteamdive.dto.RecommendationScore;
import com.himedia.projectteamdive.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class AIService {

    @Autowired
    MusicRepository mr;
    @Autowired
    MemberRecentMusicsRepository mrmr;

    public List<MusicDto> getRecommend(String mood, String memberId, Boolean signal) {
        System.out.println("추천 시스템 실행: mood=" + mood + ", memberId=" + memberId);

        int totalLimit = signal ? 200 : 20;  // isExtended가 true면 200, false면 20

        List<String> genre = getRecommendedGenres(mood);
        List<String> similarMoods = getSimilarMoods(mood);
        RecommendationScore score = getRecommendationScore(mood, signal);

        List<MusicDto> musicList = new ArrayList<>();

        Set<MusicDto> musicSet = new LinkedHashSet<>();

// 감정과 장르에 따른 추천
        try {
            List<MusicDto> moodBasedMusic = mr.getMusicByMoodAndGenre(mood, genre, PageRequest.of(0, score.getEmotionScore()));
            if (moodBasedMusic != null) {
                musicSet.addAll(moodBasedMusic);
            }
        } catch (Exception e) {
            System.out.println("감정 기반 추천 예외 발생: {}"+ e.getMessage());
        }

// 유사 감정 기반 추천
        try {
            if (musicSet.size() < score.getTotalLimit()) {
                List<MusicDto> similarMoodMusic = mr.getMusicBySimilarMoodsAndGenre(similarMoods, genre, PageRequest.of(0, score.getSimilarScore()));
                if (similarMoodMusic != null) {
                    musicSet.addAll(similarMoodMusic);
                }
            }
        } catch (Exception e) {
            System.out.println("유사 감정 기반 추천 예외 발생: {}"+ e.getMessage());
        }

// 최근 음악 기반 추천
        try {
            if (musicSet.size() < score.getTotalLimit()) {
                List<Integer> recentMusicIds = mrmr.getRecentMusicIdsByMemberId(memberId, score.getRecentMusicScore());
                if (recentMusicIds != null) {
                    List<MusicDto> recentMusic = mr.getMusicByIds(recentMusicIds);
                    if (recentMusic != null) {
                        musicSet.addAll(recentMusic);
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("최근 음악 추천 예외 발생: {}"+ e.getMessage());
        }

// 부족하면 랜덤 추천
        try {
            if (musicSet.size() < score.getTotalLimit()) {
                List<MusicDto> randomMusic = mr.getRandomMusic(PageRequest.of(0, score.getRandomScore()));
                if (randomMusic != null) {
                    musicSet.addAll(randomMusic);
                }
            }
        } catch (Exception e) {
            System.out.println("랜덤 음악 추천 예외 발생: {}"+ e.getMessage());
        }

        System.out.println("최종 추천 음악 개수: " + musicSet.size());
        return new ArrayList<>(musicSet).subList(0, Math.min(totalLimit, musicSet.size()));

    }

    private List<String> getRecommendedGenres(String mood) {
        switch (mood.toLowerCase()) {
            case "happy": return Arrays.asList("팝", "록", "전자음악");
            case "sad": return Arrays.asList("재즈", "클래식", "기타");
            case "angry": return Arrays.asList("힙합&랩", "록", "전자음악");
            case "boring": return Arrays.asList("클래식", "기타", "재즈");
            case "normal":
            default: return Arrays.asList("록", "팝", "힙합&랩", "재즈", "클래식", "전자음악", "기타");
        }
    }


    private List<String> getSimilarMoods(String mood) {
        switch (mood.toLowerCase()) {
            case "happy": return Arrays.asList("normal", "angry");
            case "sad": return Arrays.asList("boring", "normal");
            case "angry": return Arrays.asList("normal", "boring");
            case "boring": return Arrays.asList("sad", "happy");
            case "normal": return Arrays.asList("happy", "sad", "angry");
            default: return new ArrayList<>();  // 잘못된 감정 입력 시 빈 리스트 반환
        }
    }


    private RecommendationScore getRecommendationScore(String mood, Boolean signal) {
        int totalLimit = signal ? 200 : 20;

        switch (mood.toLowerCase()) {
            case "happy":
                return calculateRecommendationScore(totalLimit, 0.6, 0.2, 0.1, 0.1);
            case "sad":
                return calculateRecommendationScore(totalLimit, 0.7, 0.2, 0.06, 0.04);
            case "angry":
                return calculateRecommendationScore(totalLimit, 0.6, 0.2, 0.14, 0.06);
            case "boring":
                return calculateRecommendationScore(totalLimit, 0.5, 0.3, 0.14, 0.06);
            case "normal":
            default:
                return calculateRecommendationScore(totalLimit, 0.4, 0.3, 0.2, 0.1);
        }
    }

    private RecommendationScore calculateRecommendationScore(int total, double emotionRatio, double similarRatio, double recentRatio, double randomRatio) {
        int emotionScore = (int) (total * emotionRatio);
        int similarScore = (int) (total * similarRatio);
        int recentScore = (int) (total * recentRatio);

        int allocatedSum = emotionScore + similarScore + recentScore;
        int randomScore = Math.max(0, total - allocatedSum);

        return new RecommendationScore(emotionScore, similarScore, recentScore, randomScore);
    }

}
