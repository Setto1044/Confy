import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMeetingList } from "../../features/main/MeetingList/api/meetingListApi";

// ✅ 새로고침 시 유지할 상태 불러오기
const savedFilter = localStorage.getItem("selectedFilter") || "home";
const savedGroup = localStorage.getItem("selectedGroup");

const initialState = {
  meetings: [],
  searchQuery: "",
  loading: false,
  error: null,
  checkedItems: [],
  starredItems: [],
  selectedFilter: savedFilter, // ✅ localStorage에서 불러오기
  selectedGroup: savedGroup ? Number(savedGroup) : null, // ✅ localStorage에서 불러오기
  cursor: null,
  hasMoreItems: true,
  scheduledMeetings: [],
};

// ✅ 비동기 API 호출
export const fetchMeetings = createAsyncThunk(
  "meeting/fetchMeetings",
  async (
    { type = "all", groupId = null, cursor, size },
    { rejectWithValue }
  ) => {
    try {
      let meetings = [];
      if (type === "favorite") {
        meetings = await getFavoriteMeetings(cursor, size);
      } else {
        meetings = await getMeetingList(type, groupId, cursor, size);
      }
      return meetings;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const meetingSlice = createSlice({
  name: "meeting",
  initialState, // ✅ 여기서 위에서 선언한 initialState를 사용하도록 변경!
  reducers: {
    setMeetings: (state, action) => {
      state.meetings = action.payload;
      state.hasMoreItems = action.payload.length > 0;
      state.cursor =
        action.payload.length > 0
          ? action.payload[action.payload.length - 1].id
          : null;
    },
    updateMeetingThumbnail: (state, action) => {
      const { meetingId, summaryImagePath } = action.payload;
      state.meetings = state.meetings.map((meeting) =>
        meeting.id === meetingId
          ? {
              ...meeting,
              summaryImagePath:
                summaryImagePath || meeting.summaryImagePath || null,
            } // ✅ 새로운 객체 반환 (불변성 유지)
          : meeting
      );
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload; // ✅ 검색어 업데이트
    },
    toggleCheck: (state, action) => {
      const { meetingId, isChecked } = action.payload;
      if (isChecked) {
        state.checkedItems.push(meetingId);
      } else {
        state.checkedItems = state.checkedItems.filter(
          (id) => id !== meetingId
        );
      }
    },
    toggleStar: (state, action) => {
      const { meetingId, isStarred } = action.payload;
      if (isStarred) {
        state.starredItems.push(meetingId);
      } else {
        state.starredItems = state.starredItems.filter(
          (id) => id !== meetingId
        );
      }
    },
    clearCheckedItems: (state) => {
      state.checkedItems = [];
    },
    setFilter: (state, action) => {
      state.selectedFilter = action.payload;
      localStorage.setItem("selectedFilter", action.payload); // ✅ 로컬스토리지에 저장
      if (action.payload !== "group") {
        state.selectedGroup = null;
        localStorage.removeItem("selectedGroup");
      }
    },
    setSelectedGroup: (state, action) => {
      state.selectedFilter = "group";
      state.selectedGroup = Number(action.payload);
      localStorage.setItem("selectedFilter", "group"); // ✅ 필터도 저장
      localStorage.setItem("selectedGroup", action.payload);
    },
    addScheduledMeeting: (state, action) => {
      state.scheduledMeetings.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeetings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        const newMeetings = action.payload;

        if (newMeetings.length === 0) {
          state.hasMoreItems = false; // ✅ 더 이상 불러올 데이터가 없으면 스크롤 중지
        } else {
          // ✅ 중복 데이터 방지
          const uniqueMeetings = newMeetings.filter(
            (newMeeting) =>
              !state.meetings.some((existing) => existing.id === newMeeting.id)
          );

          state.meetings = [...state.meetings, ...uniqueMeetings];

          // ✅ 마지막 데이터의 id를 cursor로 설정
          state.cursor =
            newMeetings.length > 0
              ? newMeetings[newMeetings.length - 1].id
              : null;
        }
        state.loading = false;
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const {
  toggleCheck,
  toggleStar,
  clearCheckedItems,
  setSearchQuery,
  setFilter,
  setSelectedGroup,
  addScheduledMeeting,
  setMeetings,
  updateMeetingThumbnail,
} = meetingSlice.actions;
export default meetingSlice.reducer;
