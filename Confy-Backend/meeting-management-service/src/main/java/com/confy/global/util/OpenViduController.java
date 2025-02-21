package com.confy.global.util;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import io.livekit.server.WebhookReceiver;
import livekit.LivekitWebhook.WebhookEvent;

@CrossOrigin(origins = "*")
@RestController
public class OpenViduController {

	@Value("${livekit.api.key}")
	private String LIVEKIT_API_KEY;

	@Value("${livekit.api.secret}")
	private String LIVEKIT_API_SECRET;

	/**
	 * @param params JSON object with roomName and participantName
	 * @return JSON object with the JWT token
	 */
	@PostMapping(value = "/token")
	public ResponseEntity<Map<String, String>> createToken(@RequestBody Map<String, String> params) {
		String roomName = params.get("roomName");
		String participantName = params.get("participantName");

		System.out.println("params: " + params);
		if (roomName == null || participantName == null) {
			return ResponseEntity.badRequest().body(Map.of("errorMessage", "roomName and participantName are required"));
		}

		System.out.println("LIVEKIT_API_KEY: " + LIVEKIT_API_KEY);
		System.out.println("LIVEKIT_API_SECRET: " + LIVEKIT_API_SECRET);
		AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
		token.setName(participantName);
		token.setIdentity(participantName);
		token.addGrants(new RoomJoin(true), new RoomName(roomName));

		System.out.println("TOKEN: " + token.toJwt());
		return ResponseEntity.ok(Map.of("token", token.toJwt()));
	}

	@PostMapping(value = "/livekit/webhook", consumes = "application/webhook+json")
	public ResponseEntity<String> receiveWebhook(@RequestHeader("Authorization") String authHeader, @RequestBody String body) {
		WebhookReceiver webhookReceiver = new WebhookReceiver(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
		try {
			WebhookEvent event = webhookReceiver.receive(body, authHeader);
			System.out.println("LiveKit Webhook: " + event.toString());
		} catch (Exception e) {
			System.err.println("Error validating webhook event: " + e.getMessage());
		}
		return ResponseEntity.ok("ok");
	}

}
