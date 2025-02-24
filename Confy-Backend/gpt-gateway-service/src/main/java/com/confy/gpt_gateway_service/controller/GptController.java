package com.confy.gpt_gateway_service.controller;

import com.confy.gpt_gateway_service.model.dto.request.RealTimeRequestDto;
import com.confy.gpt_gateway_service.model.dto.response.GptResponse;
import com.confy.gpt_gateway_service.model.dto.response.RealTimeResponse;
import com.confy.gpt_gateway_service.service.GptService;
import com.confy.gpt_gateway_service.model.dto.request.GptRequestDto;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gpt")
public class GptController {

    private final GptService gptService;

    public GptController(GptService gptService) {
        this.gptService = gptService;
    }

    //실시간
    @PostMapping(value = "/{meetingId}/real-time-summary", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RealTimeResponse> generateRealTimeSummary(@PathVariable Long meetingId, @RequestBody RealTimeRequestDto request) {
        request.setMeetingId(meetingId);  // meetingId 설정
        RealTimeResponse response = gptService.generateRealTimeSummary(request);
        return ResponseEntity.ok(response);
    }

    //회의 후
    @PostMapping(value = "/{meetingId}/process", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GptResponse> processMeeting(@PathVariable Long meetingId, @RequestBody GptRequestDto request) {
        request.setMeetingId(meetingId);  // meetingId 설정
        GptResponse response = gptService.processMeeting(request);
        return ResponseEntity.ok(response);
    }

}
