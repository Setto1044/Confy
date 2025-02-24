package com.confy.controller.openVidu;

import java.util.HashMap;
import java.util.Map;

import com.confy.entity.Meeting;
import com.confy.service.meeting.MMSToUGS.GroupMembersService;
import com.confy.service.openVidu.MMSToClient.OpenViduService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import io.livekit.server.WebhookReceiver;
import livekit.LivekitWebhook.WebhookEvent;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class OpenViduController {

	@Value("${livekit.api.key}")
	private String LIVEKIT_API_KEY;

	@Value("${livekit.api.secret}")
	private String LIVEKIT_API_SECRET;

	private final OpenViduService openviduService;

	/**
	 * @param params JSON object with roomName and participantName
	 * @return JSON object with the JWT token
	 */
	@PostMapping(value = "/token")
	public ResponseEntity<Map<String, String>> createToken(@RequestHeader("X-User-Id") Long id, @RequestBody Map<String, String> params) {
		//String roomName = params.get("meeting_name"); //현재 roomName으로 방을 구분한다.
		//String participantName = params.get("participantName");
		String UUID = params.get("uuid");
		String speaker = params.get("speaker");

		if (id == null || UUID == null || speaker == null) {
			return ResponseEntity.status(400).body(Map.of("errorMessage", "userId, UUID, speaker가 필요합니다."));
		}

		try{
			// Meeting 조회 및 is_online 업데이트
			Meeting meeting = openviduService.validateAndEnterMeeting(UUID, id, speaker);

			//유효하지 않은 사용자라면 token을 생성하지 않아야 함.
			AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
			token.setName(String.valueOf(id)); //토큰에 사용자의 이름을 설정하는 역할
			token.setIdentity(String.valueOf(id)); //사용자 PK로 구분
			token.addGrants(new RoomJoin(true), new RoomName(UUID)); //실제로 방에 입장할 수 있는 권한(grant)을 부여하는 핵심 로직
			/*
				LiveKit의 AccessToken을 생성한 후, 두 가지 Grant를 추가합니다:
				new RoomJoin(true)는 참가자가 해당 방에 입장할 수 있도록 허용합니다.
				new RoomName(roomName)는 토큰에 특정 roomName을 부여하여, 이 토큰이 해당 회의실에만 유효함을 명시합니다.
			*/
			Map<String, String> response = new HashMap<>();
			response.put("token", token.toJwt());
			response.put("meetingId", String.valueOf(meeting.getMeetingId()));

			log.info(">> meetingId: {}", meeting.getMeetingId());
			log.info(">> token: {}", token.toJwt());

			return ResponseEntity.status(200).body(response);
		}catch(Exception e){
			return ResponseEntity.status(400).body(Map.of("errorMessage", e.getMessage()));
		}

	}

	@PostMapping(value = "/livekit/webhook", consumes = "application/webhook+json")
	public ResponseEntity<String> receiveWebhook(@RequestHeader("Authorization") String authHeader, @RequestBody String body) {
		WebhookReceiver webhookReceiver = new WebhookReceiver(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
		try {
			WebhookEvent event = webhookReceiver.receive(body, authHeader);
			//System.out.println("LiveKit Webhook: " + event.toString());
		} catch (Exception e) {
			//System.err.println("Error validating webhook event: " + e.getMessage());
		}
		return ResponseEntity.ok("ok");
	}

}
