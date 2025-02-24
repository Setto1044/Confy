package com.confy.service.meeting.MMSToClient;

import com.confy.dto.MMSToClient.*;
import com.confy.dto.MMSToGPT.GptRequestDto;
import com.confy.dto.MMSToGPT.GptResponseDto;
import com.confy.entity.Meeting;
import com.confy.entity.Summary;
import com.confy.entity.UserMeeting;
import com.confy.repository.MeetingRepository;
import com.confy.repository.SentenceRepository;
import com.confy.entity.Sentence;
import com.confy.repository.SummaryRepository;
import com.confy.repository.UserMeetingRepository;
import com.confy.service.meeting.MMSToGPT.GptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MeetingResultServiceImpl implements MeetingResultService {

    private final MeetingRepository meetingRepository;
    private final SentenceRepository sentenceRepository;
    private final SummaryRepository summaryRepository;
    private final UserMeetingRepository userMeetingRepository;
    private final GptService gptService;

    @Override
    public void processMeetingEnd(Long meetingId) {
        ScriptResponseDto dto = findScript(meetingId);
//        log.info("meeting end script response: {}", dto.getScript());
        GptRequestDto gptRequestDto = new GptRequestDto(meetingId, dto.getScript());

        // 비동기적으로 처리되는 Mono에서 값을 얻고, 결과가 반환된 후 saveSummaryToMySQL 호출
        gptService.requestProcessFromGpt(gptRequestDto)
                .subscribe(response -> {
                    // 비동기적으로 반환된 GptResponseDto 처리
                    log.info("Gpt response: {}", response);
                    saveSummaryToMySQL(response); // response를 바로 사용
                });
    }
    @Transactional
    @Override
    public void saveSummaryToMySQL(GptResponseDto response) {
        // GptResponseDto에서 필요한 값을 추출
        String textSummary = response.getSummary();       // 요약 텍스트
        String visualSummary = response.getVisualization(); // 시각화 데이터 (JSON 형식)
        String keywords = response.getKeywords();          // 키워드
        Summary.VisualType visualType = Summary.VisualType.Tree;

        // Meeting 엔티티를 가져오는 방법: meetingId로 찾거나 적절한 방식으로 가져옵니다.
        Meeting meeting = meetingRepository.findById(response.getMeetingId())
                .orElseThrow(() -> new RuntimeException("Meeting not found"));

        // 기존 Summary 엔티티 조회
        Summary summary = summaryRepository.findByMeeting_MeetingId(meeting.getMeetingId());

        // 필드 업데이트
        summary.setTextSummary(textSummary);
        summary.setVisualSummary(visualSummary);
        summary.setKeywords(keywords);

        // 변경 내용 저장
        summaryRepository.save(summary);
    }


    @Override
    public ScriptResponseDto findScript(Long meetingId) {
        List<Sentence> sentences = sentenceRepository.findByMeeting_MeetingId(meetingId);

        // Sentence 엔티티를 SentenceDto로 변환
        List<SentenceDto> sentenceDtos = sentences.stream()
                .map(SentenceDto::fromEntity) // 엔티티 -> DTO 변환
                .collect(Collectors.toList());

        // ScriptResponseDto로 반환
        return ScriptResponseDto.of(sentenceDtos);
    }

    @Override
    public VisualResponseDto findVisualJson(Long meetingId) {
        // Summary에서 visualSummary만 가져오기
        Summary summary = summaryRepository.findByMeeting_MeetingId(meetingId);
        if (summary == null) {
            return null; // Summary가 없으면 null 반환
        }
        return VisualResponseDto.of(summary.getVisualSummary());
    }

    @Override
    public TextSummaryResponseDto findTextSummary(Long meetingId) {
        // Summary에서 textSummary만 가져오기
        Summary summary = summaryRepository.findByMeeting_MeetingId(meetingId);
        if (summary == null) {
            return null; // Summary가 없으면 null 반환
        }
        return TextSummaryResponseDto.of(summary.getTextSummary());
    }

    @Override
    public KeywordsResponseDto findKeywords(Long meetingId) {
        // Summary에서 keywords만 가져오기
        Summary summary = summaryRepository.findByMeeting_MeetingId(meetingId);
        if (summary == null) {
            return null; // Summary가 없으면 null 반환
        }

        // keywords 문자열을 쉼표로 구분하여 List<String>으로 변환
        List<String> keywordsList = null;
        if (summary.getKeywords() != null && !summary.getKeywords().isEmpty()) {
            keywordsList = Arrays.asList(summary.getKeywords().split(",\\s*")); // 쉼표와 공백을 구분자로 처리
        }

        return KeywordsResponseDto.of(keywordsList);
    }

    @Override
    public boolean canEditResult(Long userId, Long meetingId) {
        // Meeting 엔티티 전체 조회 대신 프록시 객체 생성 (데이터베이스 조회 생략)
        Meeting meetingReference = meetingRepository.getReferenceById(meetingId);
        // 기존 메서드를 사용하여 user와 meeting 간의 관계 존재 여부 확인
        Optional<UserMeeting> userMeetingOpt = userMeetingRepository.findByMeetingAndUserId(meetingReference, userId);
        if (userMeetingOpt.isEmpty()) {
           return false;
        }
        return true;
    }

    @Transactional
    @Override
    public void updateVisual(Long meetingId, VisualEditRequestDto requestDto) {
        Summary summary = summaryRepository.findByMeeting_MeetingId(meetingId);
        if(summary == null) {
            throw new RuntimeException("요약을 찾을 수 없습니다. meetingId = " + meetingId);
        }
        summary.setVisualSummary(requestDto.getData());
        summaryRepository.save(summary);
    }

    @Transactional
    @Override
    public void updateSummary(Long meetingId, SummaryEditRequestDto requestDto) {
        Summary summary = summaryRepository.findByMeeting_MeetingId(meetingId);
        if(summary == null) {
            throw new RuntimeException("요약을 찾을 수 없습니다. meetingId = " + meetingId);
        }
        summary.setTextSummary(requestDto.getData());
        summaryRepository.save(summary);
    }

    /**
     * composite 메서드
     * 회의 결과 화면을 위해 script와 summary 관련 데이터(visual, text, keywords)를 한 번의 호출로 모두 조회
     * 현재 API 명세로는 회의 목록을 조회할 때마다 동일한 쿼리가 3번 날아가는데,
     * 이를 개선하기 위해 회의 결과 목록에서 meetingId로
     */
    @Override
    public MeetingResultDto findMeetingResult(Long meetingId) {
        // script는 SentenceRepository에서 별도로 조회
        ScriptResponseDto script = findScript(meetingId);

        // summary는 한 번만 DB에서 조회하여 여러 DTO로 변환
        Summary summary = summaryRepository.findByMeeting_MeetingId(meetingId);
        VisualResponseDto visual = null;
        TextSummaryResponseDto text = null;
        KeywordsResponseDto keywords = null;
        if (summary != null) {
            visual = VisualResponseDto.of(summary.getVisualSummary());
            text = TextSummaryResponseDto.of(summary.getTextSummary());

            List<String> keywordsList = null;
            if (summary.getKeywords() != null && !summary.getKeywords().isEmpty()) {
                keywordsList = Arrays.asList(summary.getKeywords().split(",\\s*"));
            }
            keywords = KeywordsResponseDto.of(keywordsList);
        }

        return new MeetingResultDto(meetingId.intValue(), script, visual, text, keywords);
    }

    @Override
    public List<String> getParticipantsByMeetingId(Long meetingId) {
        return userMeetingRepository.findParticipantsByMeetingId(meetingId);
    }
}
