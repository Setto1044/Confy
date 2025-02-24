package com.confy.gpt_gateway_service.service;

import com.confy.gpt_gateway_service.client.OpenAIClient;
import com.confy.gpt_gateway_service.model.dto.request.GptRequestDto;
import com.confy.gpt_gateway_service.model.dto.request.RealTimeRequestDto;
import com.confy.gpt_gateway_service.model.dto.request.SentenceDto;
import com.confy.gpt_gateway_service.model.dto.response.GptResponse;
import com.confy.gpt_gateway_service.model.dto.response.RealTimeResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class GptService {

    private final OpenAIClient openAiClient;

    public GptService(OpenAIClient openAiClient) {
        this.openAiClient = openAiClient;
    }
    // 회의 중 실시간 요약
    public RealTimeResponse generateRealTimeSummary(RealTimeRequestDto request) {
        List<Map<String, Object>> formattedMessages = formatMessages(
                request.getScript(),
                "You are an AI assistant that summarizes meetings. " +
                        "Format the summary with a 'Participants' section, followed by a 'Summary' section with numbered points. " +
                        "Use clear structure and shortened sentences. Respond in Korean. " +
                        "Do not include any concluding phrases."
        );
        String summary = openAiClient.generateSummary(formattedMessages);
        RealTimeResponse response = new RealTimeResponse(request.getMeetingId(), summary);

        System.out.println("Received request in GPT Gateway: " + request);

        return response;
    }

// 회의 종료 후

    // 전체 요청
    public GptResponse processMeeting(GptRequestDto request) {
        // 초기 GptResponse 객체 생성 (모든 필드 null로 초기화)
        GptResponse response = new GptResponse(request.getMeetingId(), null, null, null);

        // 각 메서드를 호출하면서 GptResponse 객체 업데이트
        generateSummary(request, response);
        generateJson(request, response);
        generateKeywords(request, response);
        // 최종 통합된 결과를 반환
        return response;
    }


    public void generateSummary(GptRequestDto request, GptResponse response) {
        List<Map<String, Object>> formattedMessages = formatMessages(
                request.getScript(),
                "You are an AI assistant that summarizes meetings. Can you summarize this script in Markdown format with clear headings and bullet points? Use shortened sentences. Respond in Korean.");
        String summary = openAiClient.generateSummary(formattedMessages);
        System.out.println("Received request in GPT Gateway: " + request);

        // GptResponse 객체에 summary 추가
        response.setSummary(summary);

    }

    public void generateJson(GptRequestDto request, GptResponse response) {
        List<Map<String, Object>> formattedMessages = formatMessages(request.getScript(),
                "너는 회의 내용을 분석하여 다음 JSON 구조에 맞게 요약을 생성해야 해.\n" +
                        "응답은 반드시 JSON 형식으로만 출력해야 하며, 그 외의 설명이나 텍스트를 포함하지 말 것.\n" +
                        "JSON 외의 추가 텍스트가 있으면 요청이 실패한 것으로 간주함.\n" +
                        "JSON의 구조는 다음과 같아:\n" +
                        "{\n" +
                        "  \"agendaItems\": [\n" +
                        "    {\"id\": \"1\", \"type\": \"topic\", \"data\": {\"idea\": \"핵심 주제\"}, \"position\": {\"x\":250, \"y\":0}},\n" +
                        "    {\"id\": \"2\", \"type\": \"opinion\", \"data\": {\"idea\": \"의견1\"}, \"position\": {\"x\":100, \"y\":100}},\n" +
                        "    {\"id\": \"3\", \"type\": \"opinion\", \"data\": {\"idea\": \"의견2\"}, \"position\": {\"x\":400, \"y\":100}},\n" +
                        "    {\"id\": \"4\", \"type\": \"opinion\", \"data\": {\"idea\": \"의견3\"}, \"position\": {\"x\":250, \"y\":200}},\n" +
                        "    {\"id\": \"5\", \"type\": \"opinion\", \"data\": {\"idea\": \"의견4\"}, \"position\": {\"x\":250, \"y\":300}}\n" +
                        "  ],\n" +
                        "  \"relations\": [\n" +
                        "    {\"id\": \"r1\", \"source\": \"1\", \"target\": \"2\"},\n" +
                        "    {\"id\": \"r2\", \"source\": \"1\", \"target\": \"3\"},\n" +
                        "    {\"id\": \"r3\", \"source\": \"2\", \"target\": \"4\"},\n" +
                        "    {\"id\": \"r4\", \"source\": \"3\", \"target\": \"4\"},\n" +
                        "    {\"id\": \"r5\", \"source\": \"4\", \"target\": \"5\"}\n" +
                        "  ]\n" +
                        "}\n\n" +
                        "**매우 중요한 주의 사항**\n" +
                        "1. `agendaItems` 개수는 반드시 5~10개로 유지할 것. (10개 초과 시 요청 실패로 간주)\n" +
                        "2. 각 `agendaItems` 요소는 시각화될 노드이므로 반드시 `position` 값을 가져야 함. (X, Y 값이 없으면 요청 실패로 간주)\n" +
                        "3. `relations`은 `agendaItems` 요소 간의 관련성과 논리적 연결 관게를 반영한 간선임.\n\n" +
                        "지금부터 주어진 회의 스크립트를 분석하고, 위에서 제공한 JSON 형식으로 응답해.\\n\\n"
        );
        String jsonData = openAiClient.generateVisualization(formattedMessages);
        response.setVisualization(jsonData);
        // GptResponse 객체에 visualization 추가
    }

    public void generateKeywords(GptRequestDto request, GptResponse response) {
        List<Map<String, Object>> formattedMessages = formatMessages(request.getScript(),
                "Extract the most important keywords from the following meeting transcript, up to 7 keywords. Your answer must contain ONLY the comma-separated keywords (e.g., keywordA, keywordB, keywordC) with no additional text, explanation, or quotation marks.\n");
        String keywords = openAiClient.extractKeywords(formattedMessages);

        // GptResponse 객체에 keywords 추가
        response.setKeywords(keywords);

    }

    private List<Map<String, Object>> formatMessages(List<SentenceDto> script, String systemMessage) {
        List<Map<String, Object>> formattedMessages = new ArrayList<>();
        formattedMessages.add(Map.of("role", "system", "content", systemMessage));
        formattedMessages.add(Map.of("role", "system", "content",
                "참고: 스크립트는 STT로 기록된 것이므로 오인식으로 추정되는 단어는 맥락에 맞춰 옳게 수정해서 분석해줘."));

        for (SentenceDto dto : script) {
            formattedMessages.add(Map.of(
                    "role", "user",
                    "content", dto.getSpeaker() + ": " + dto.getContent() + "\n"
            ));
        }
        return formattedMessages;
    }

    public static void main(String[] args) {

    }
}