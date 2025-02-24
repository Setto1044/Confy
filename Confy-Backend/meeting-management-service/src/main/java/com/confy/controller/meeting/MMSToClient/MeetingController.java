package com.confy.controller.meeting.MMSToClient;

import com.confy.common.responseDto.ApiResponseDto;
import com.confy.dto.MMSToClient.*;
import com.confy.dto.MMSToGPT.GptRequestDto;
import com.confy.dto.MMSToGPT.GptResponseDto;
import com.confy.dto.MMSToGPT.RealTimeRequestDto;
import com.confy.dto.MMSToGPT.RealTimeResponseDto;
import com.confy.entity.Meeting;
import com.confy.service.meeting.MMSToClient.MeetingResultService;
import com.confy.service.meeting.MMSToClient.MeetingService;
import com.confy.service.meeting.MMSToClient.UserMeetingService;
import com.confy.service.meeting.MMSToGPT.GptService;
import com.confy.service.stt.SttService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Slf4j
@RestController
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
@RequestMapping("/api/meetings/room")
public class MeetingController {

    private final MeetingService meetingService;
    private final UserMeetingService userMeetingService;
    private final GptService gptService;
    private final SttService sttService;
    private final MeetingResultService meetingResultService;

    @PostMapping(value = "/create")
    public ResponseEntity<ApiResponseDto<MeetingCreateResponseDto>> createUUID(@RequestHeader("X-User-Id") Long id, @RequestBody MeetingCreateRequestDto dto) {
        try{
            Meeting meeting = meetingService.generateUUID(id, dto);
            log.info(" >> 1 meeting created: " + meeting.getMeetingUuid());
            meetingService.saveMeeting(meeting, dto.getVisualType());

            log.info(">> 2 meeting created: " + meeting.getMeetingUuid());

            MeetingCreateResponseDto responseDto = MeetingCreateResponseDto.of(meeting.getMeetingId(), meeting.getMeetingUuid());

            return ResponseEntity.status(200).body(ApiResponseDto.success("새로운 회의방이 생성되었습니다.", responseDto));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponseDto.error("회의 생성에 실패하였습니다 : " + e.getMessage()));

        }

    }

    @GetMapping("/{meetingId}/script")
    public ResponseEntity<ApiResponseDto<MeetingScriptResponseDto>> getScript(@RequestHeader("X-User-Id") Long id, @PathVariable("meetingId") Long meetingId){

        try{
            MeetingScriptResponseDto dto = meetingService.getMeetingScript(id, meetingId);
            return ResponseEntity.ok(ApiResponseDto.success("전체 스크립트 전송 성공", dto));

        }catch (IllegalArgumentException e) {
            log.warn("스크립트 조회 실패 - {}", e.getMessage());
            return ResponseEntity.status(400).body(ApiResponseDto.error(e.getMessage()));

        }catch (Exception e) {

            log.error("스크립트 조회 중 서버 오류 발생", e);
            return ResponseEntity.status(500).body(ApiResponseDto.error("전체 스크립트 전송 실패"));
        }
    }

    @GetMapping("/{meetingId}/speakers")
    public ResponseEntity<ApiResponseDto<MeetingSpeakersResponseDto>> getSpeakers(@RequestHeader("X-User-Id") Long id, @PathVariable("meetingId") Long meetingId){
        //참여자 목록 조회
        try {
            List<String> speakers = userMeetingService.getSpeakersByMeetingId(meetingId);

            return ResponseEntity.ok(ApiResponseDto.success("참가자 목록 조회 성공", MeetingSpeakersResponseDto.of(speakers)));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponseDto.error("참가자 목록 조회 실패: " + e.getMessage()));
        }
    }

    @PostMapping("/{meetingId}/exit")
    public ResponseEntity<ApiResponseDto<MeetingExitDto>> exit(@RequestHeader("X-User-Id") Long id, @PathVariable("meetingId") Long meetingId) {
        // 화상회의 방을 나간다.
        try {
            MeetingExitDto responseDto = userMeetingService.exitMeeting(meetingId, id);

            return ResponseEntity.status(200).body(ApiResponseDto.success("회의방 나가기 성공", responseDto));

        } catch (IllegalArgumentException e) {
            log.warn("회의방 나가기 실패 - {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponseDto.error(e.getMessage()));

        } catch (Exception e) {
            log.error("회의방 나가기 중 서버 오류 발생", e);
            return ResponseEntity.status(500).body(ApiResponseDto.error("서버 오류로 인해 회의방 나가기가 실패했습니다."));
        }

    }

    @PutMapping("/{meetingId}/finish")
    public ResponseEntity<ApiResponseDto<Void>> updateMeeting(@RequestHeader("X-User-Id") Long id,
                                                              @PathVariable("meetingId") Long meetingId,
                                                              @RequestBody MeetingUpdateRequestDto dto){
        String meetingUuid = dto.getMeetingUUID();
        if(meetingUuid == null || meetingUuid.isEmpty()) {
            return ResponseEntity.status(400).body(ApiResponseDto.error("meetingUUID가 필요합니다."));
        }

        try {
            boolean isFinished = meetingService.finishMeeting(meetingId, meetingUuid, id);

//            //회의 종료 후 Redis STT 데이터를 MySQL에 저장(비동기 처리)
//            CompletableFuture.runAsync(() -> sttService.saveSttDataToDatabase(meetingId));

            // 회의 종료 후 Redis STT 데이터를 MySQL에 저장한 후 후속 로직 실행
            CompletableFuture.runAsync(() -> {
                        log.info("### STT 데이터 저장 시작: meetingId={}", meetingId);
                        sttService.saveSttDataToDatabase(meetingId);
                        log.info("### STT 데이터 저장 완료: meetingId={}", meetingId);
                    })
                    .thenRunAsync(() -> {
                        log.info("### meetingResultService.processMeetingEnd 실행 시작: meetingId={}", meetingId);
                        meetingResultService.processMeetingEnd(meetingId);
                        log.info("### meetingResultService.processMeetingEnd 실행 완료: meetingId={}", meetingId);
                    });

            return ResponseEntity.ok(ApiResponseDto.success("회의가 정상적으로 종료되었습니다."));
        }catch (Exception e){
            return ResponseEntity.status(400).body(ApiResponseDto.error("회의 종료가 실패하였습니다"));
        }
    }

    // 실시간 요약 요청
    @PostMapping("/{meetingId}/summary")
    public Mono<ResponseEntity<ApiResponseDto<RealTimeResponseDto>>> getRealTimeSummary(@RequestHeader("X-User-Id") Long id,
                                                                  @PathVariable Long meetingId,
                                                                  @RequestBody RealTimeRequestDto request) {

        return gptService.requestRealTimeSummary(request, id, meetingId)
                .map(response -> {
                    return ResponseEntity.ok(ApiResponseDto.success("실시간 요약 성공", response));

                })
                .onErrorResume(e -> {
                    // 예외 발생 시 실패 응답 반환
                    log.error("실시간 요약 실패 - {}", e.getMessage(), e);
                    return Mono.just(ResponseEntity.status(500).body(ApiResponseDto.error("실시간 요약 실패")));
                });
    }

    // 회의 종료 후 요청 처리 (요약, 시각화, 키워드 추출)
    @PostMapping("/{meetingId}/process")
    public Mono<ResponseEntity<GptResponseDto>> processGptRequest(@PathVariable Long meetingId, @RequestBody GptRequestDto requestDto) {
        requestDto.setMeetingId(meetingId);
        return gptService.requestProcessFromGpt(requestDto).map(ResponseEntity::ok);
    }
}
