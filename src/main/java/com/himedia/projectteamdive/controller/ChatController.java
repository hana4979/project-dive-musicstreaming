package com.himedia.projectteamdive.controller;

import com.himedia.projectteamdive.dto.MusicDto;
import com.himedia.projectteamdive.service.ChatService;
import com.himedia.projectteamdive.service.MusicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")

public class ChatController {

    @Autowired
    private ChatService chatService;


    @Autowired
    private MusicService musicService;


    @PostMapping("/ask")
    // ResponseEntity<?> 를 쓰면 HaspMap보다 더 유연하게 HTTP 상태코드를 쉽게 지정 할 수 있다함
    //   ResponseEntity.badRequest() 이런거로 에러응답을 직관적으로 가능하게 한다함
    public ResponseEntity<?> chat(@RequestBody HashMap<String, Object> request) {
        try {
            String userMessage = (String) request.get("text");
            if (userMessage == null || userMessage.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "메시지가 비어 있습니다."));
            }  // 걍 에러반환




            // 챗서비스에서 사용자가 입력한 내용을 토대로 내 api가지고 있는 gpt응답을 response에 저장함
            String response = chatService.chatWithGPT(userMessage);

            // 아직 더 추가해야함
            Map<String, String> moodMap = new HashMap<>();
            moodMap.put("슬퍼", "sad");
            moodMap.put("슬픈", "sad");
            moodMap.put("우울", "sad");
            moodMap.put("기뻐", "happy");
            moodMap.put("기쁜", "happy");
            moodMap.put("행복", "happy");
            moodMap.put("신나", "happy");
            moodMap.put("짜증", "angry");
            moodMap.put("화가", "angry");
            moodMap.put("화나", "angry");
            moodMap.put("나빠", "angry");
            moodMap.put("지루", "boring");
            moodMap.put("심심", "boring");
            moodMap.put("루즈", "boring");
            moodMap.put("랜덤", "normal");
            moodMap.put("아무", "normal");
            moodMap.put("일상", "normal");
            moodMap.put("무난", "normal");


            // 보낸 메세지에 저거 있으면 넣고
            String detectedMood = null;
            for (String keyword : moodMap.keySet()) {
                if (userMessage.contains(keyword)) {
                    detectedMood = moodMap.get(keyword);
                    break;
                }
            }

            // "슬퍼" 기분적인것만 말해도 노래리스트가 나와서 조건 추가함
            boolean userRequestMusic = userMessage.contains("노래 추천")
                    || userMessage.contains("추천") ;






            if (detectedMood != null && userRequestMusic) {
                List<MusicDto> recommendedMusic = musicService.getMusicByMood(detectedMood);
                if (!recommendedMusic.isEmpty()) {
                    List<MusicDto> limitedMusic = recommendedMusic.size() > 10
                            ? recommendedMusic.subList(0, 10)
                            : recommendedMusic;

                    // 감정별 랜덤 문구 설정
                    Map<String, List<String>> responseTemplates = new HashMap<>();
                    responseTemplates.put("happy", List.of(
                            "기분이 너무 좋겠어요! 이런 노래들은 어때요? 😊",
                            "신나는 기분엔 이런 곡들이 잘 어울릴 거예요! 🎶",
                            "행복할 땐 음악이 더 즐거움을 배가시켜주죠! 추천드릴게요!"
                    ));
                    responseTemplates.put("sad", List.of(
                            "조금이라도 기분이 나아졌으면 좋겠어요. 이런 노래들은 어떨까요? 😢",
                            "우울할 때 위로가 될 만한 곡들을 찾아봤어요.",
                            "기분이 가라앉을 때 들으면 좋은 노래들이에요."
                    ));
                    responseTemplates.put("angry", List.of(
                            "화날 땐 음악으로 기분을 풀어보는 것도 방법이에요! 🎵",
                            "짜증날 땐 리듬감 있는 음악을 듣는 게 도움이 될 수도 있어요.",
                            "분노를 가라앉히는 데 도움이 될 만한 곡들이에요."
                    ));
                    responseTemplates.put("boring", List.of(
                            "심심할 땐 새로운 음악을 탐험해보는 것도 좋죠! 이런 곡들은 어때요? 🎧",
                            "지루한 순간을 채워줄 음악을 추천해 드릴게요!",
                            "일상을 특별하게 만들어줄 곡들을 준비했어요!"
                    ));
                    responseTemplates.put("normal", List.of(
                            "잔잔한 하루에도 음악은 필수죠! 이런 곡들은 어떨까요?",
                            "평범한 날에도 분위기를 바꿔줄 노래가 필요하죠!",
                            "오늘 하루를 채워줄 음악을 추천해 드릴게요."
                    ));

                    // 감정에 맞는 랜덤 문구 선택
                    String moodResponse = responseTemplates.containsKey(detectedMood)
                            ? responseTemplates.get(detectedMood).get((int) (Math.random() * responseTemplates.get(detectedMood).size()))
                            : "기분에 맞는 음악을 찾아봤어요! 🎶";

                    //  노래 리스트 생성
                    StringBuilder musicInfo = new StringBuilder("<br>" + moodResponse + "<br>");
                    for (MusicDto md : limitedMusic) {
                        musicInfo.append(md.getTitle()).append(" - ").append(md.getArtistName()).append("<br>");
                    }
                    response = musicInfo.toString();
                }
            }


            return ResponseEntity.ok(Map.of("reply", response));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "서버 오류 발생"));
        }
    }
}

