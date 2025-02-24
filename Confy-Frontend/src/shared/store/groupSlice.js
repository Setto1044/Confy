import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGroupMembers } from "../../features/main/GroupMember/api/groupMemberApi";
import {
  getGroupList,
  createGroup,
  updateGroupName,
  leaveGroup,
} from "../../features/main/Sidebar/api/groupListApi";
import { inviteGroupMembers } from "../../features/main/GroupMember/api/groupMemberApi";

// ✅ 그룹 목록 불러오기
export const fetchGroups = createAsyncThunk("group/fetchGroups", async () => {
  return await getGroupList();
});

// ✅ 새 그룹 생성
export const addGroup = createAsyncThunk(
  "group/addGroup",
  async (groupName) => {
    return await createGroup(groupName);
  }
);

// ✅ 그룹 이름 수정
export const editGroupName = createAsyncThunk(
  "group/editGroupName",
  async ({ groupId, newGroupName }) => {
    return await updateGroupName(groupId, newGroupName);
  }
);

// ✅ 그룹 나가기(삭제)
export const removeGroup = createAsyncThunk(
  "group/removeGroup",
  async (groupId) => {
    await leaveGroup(groupId);
    return groupId; // 성공하면 groupId 반환
  }
);

// ✅ 특정 그룹 멤버 불러오기
export const getGroupMembers = createAsyncThunk(
  "group/fetchMembers",
  async (groupId) => {
    return await fetchGroupMembers(groupId);
    return response;
  }
);

// ✅ 그룹 멤버 초대
export const inviteMembers = createAsyncThunk(
  "group/inviteMembers",
  async ({ groupId, userEmails }) => {
    return await inviteGroupMembers(groupId, userEmails);
  }
);

const groupSlice = createSlice({
  name: "group",
  initialState: {
    groups: [],
    members: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload; // ✅ 그룹 목록 저장
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload); // ✅ 새 그룹 추가
      })
      .addCase(editGroupName.fulfilled, (state, action) => {
        const { id, groupName } = action.payload;
        const groupIndex = state.groups.findIndex((g) => g.id === id);
        if (groupIndex !== -1) {
          state.groups[groupIndex].groupName = groupName; // ✅ 이름 업데이트
        }
      })
      .addCase(removeGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter(
          (group) => group.id !== action.payload
        ); // ✅ 그룹 삭제 반영
      })
      .addCase(getGroupMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGroupMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(getGroupMembers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.response?.data?.message || action.error.message;
      })
      .addCase(inviteMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(inviteMembers.fulfilled, (state, action) => {
        state.loading = false;
        const newMembers = action.payload.filter(
          (newMember) =>
            !state.members.some((member) => member.userId === newMember.userId)
        );
        state.members = [...state.members, ...newMembers];
      })
      .addCase(inviteMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default groupSlice.reducer;
