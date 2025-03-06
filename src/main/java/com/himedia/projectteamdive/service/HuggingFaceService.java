package com.himedia.projectteamdive.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@Service
public class HuggingFaceService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper(); // JSON 파싱용

    // HuggingChat API 엔드포인트 (확인 필요)
    private final String apiUrl = "https://api-inference.huggingface.co/models/mistralai/Mistral-Nemo-Instruct-2407";

    @Value("${huggingface.api.token}")
    private String huggingFaceApiToken;

    public String getAIResponse(String userMessage) {
        try {
            // 요청 바디 생성
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("inputs", userMessage);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(huggingFaceApiToken);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // 응답을 String으로 받기
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, String.class);

            // 응답이 JSON인지 확인하고 파싱
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());

                // JSON 배열인지 확인하고 첫 번째 응답 가져오기
                if (jsonNode.isArray() && jsonNode.size() > 0) {
                    return jsonNode.get(0).path("generated_text").asText();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "AI 응답 오류 발생. 다시 시도해주세요.";
        }

        return "AI 응답을 가져오지 못했습니다.";
    }
}
