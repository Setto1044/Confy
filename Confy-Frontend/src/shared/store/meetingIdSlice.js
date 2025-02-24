import { createSlice } from "@reduxjs/toolkit";

// 초기 상태
const initialState = {
  meetingId: sessionStorage.getItem("meetingId") || "", // 새로고침해도 유지
  participantsList: [], // ✅ 참여자 목록만 유지
};

const meetingIdSlice = createSlice({
  name: "meetingId",
  initialState,
  reducers: {
    //✅ meetingId를 저장하는 액션
    setMeetingId: (state, action) => {
      state.meetingId = action.payload;
      sessionStorage.setItem("meetingId", action.payload); // sessionStorage에도 저장
    },

    // ✅ 회의 나가기 시 호출되는 액션
    clearMeetingId: (state) => {
      state.meetingId = "";
      state.participantsList = []; // ✅ 참여자 목록만 초기화
      sessionStorage.removeItem("meetingId");
    },

    // ✅ 참여자 목록을 업데이트하는 액션
    setParticipantsList: (state, action) => {
      state.participantsList = action.payload;
    },

    // ✅ 특정 참가자를 목록에서 제거하는 액션 (퇴장 시)
    removeParticipant: (state, action) => {
      state.participantsList = state.participantsList.filter(
        (participant) => participant.id !== action.payload
      );
    },
  },
});

// 액션과 리듀서 내보내기
export const { 
  setMeetingId, 
  clearMeetingId, 
  setParticipantsList, 
  removeParticipant 
} = meetingIdSlice.actions;

export default meetingIdSlice.reducer;
