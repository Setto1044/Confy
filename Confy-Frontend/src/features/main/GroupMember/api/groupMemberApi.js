import groupClient from "../../../../shared/api/apiClient/groupClient";

// ✅ 특정 그룹의 멤버 조회 API 요청 함수
export const fetchGroupMembers = async (groupId) => {
  try {
    const response = await groupClient.get(`/groups/members/${groupId}`);

    if (!response.data.success) {
      throw new Error(response.data.message || "그룹 멤버 조회 실패");
    }

    return response.data.data.members;
  } catch (error) {
    console.error(
      "❌ 그룹 멤버 조회 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ 그룹에 회원 초대 API 요청
export const inviteGroupMembers = async (groupId, userEmails) => {
  try {
    const response = await groupClient.post(`/groups/invite/${groupId}`, {
      userEmails,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "초대 실패");
    }

    return response.data.data.groupMembers;
  } catch (error) {
    console.error(
      "❌ 그룹 멤버 초대 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};
