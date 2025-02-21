
package com.confy.gpt_gateway_service.client;

import com.confy.gpt_gateway_service.provider.TreeFunctionSpecProvider;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class OpenAIClient {

    private final WebClient webClient;
    private final ObjectMapper objectMapper; //JSON parsing

    @Value("${spring.ai.openai.api-key}")
    private String openAiApiKey;

    public OpenAIClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.openai.com/v1").build();
        this.objectMapper = new ObjectMapper();  // ObjectMapper 초기화
    }

    public String generateSummary(List<Map<String, Object>> messages) {
        return sendRequestToOpenAI(messages);
    }

    public String generateVisualization(List<Map<String, Object>> messages) {
        return sendRequestToOpenAI(messages);
    }

    public String extractKeywords(List<Map<String, Object>> messages) {
        return sendRequestToOpenAI(messages);
    }

    private String sendJsonRequestToOpenAI(List<Map<String, Object>> messages) {
        log.info("★★프롬프트★★ ");
        log.info(messages.toString());
        Map<String, Object> requestBody = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", messages,
                "temperature", 0.5,
                "functions", List.of(TreeFunctionSpecProvider.TREE_FUNCTION_SPEC),
                "function_call", Map.of("name", "generateTreeVisualization")
        );

        String response =  webClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + openAiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return extractContentFromResponse(response);
    }

    private String sendRequestToOpenAI(List<Map<String, Object>> messages) {
        Map<String, Object> requestBody = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", messages,
                "temperature", 0.4
        );

        String response =  webClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + openAiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return extractContentFromResponse(response);
    }

    private String extractContentFromResponse(String response) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode messageNode = rootNode.path("choices").get(0).path("message");

            log.info("generated response: {}", rootNode);

            // function_call 필드가 있으면 그 안의 arguments 값을 사용 (Json 요청일 때만)
            if (messageNode.has("function_call")) {
                return messageNode.path("function_call").path("arguments").asText();
            }
            // 그렇지 않으면 content 값을 사용
            return messageNode.path("content").asText();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error parsing response";
        }
    }
}