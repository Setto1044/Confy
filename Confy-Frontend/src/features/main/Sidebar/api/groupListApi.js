import groupClient from "../../../../shared/api/apiClient/groupClient";

// ✅ 내가 속한 그룹 조회 API 요청 함수
export const getGroupList = async () => {
  try {
    const response = await groupClient.get("/groups/all");

    if (!response.data.success) {
      throw new Error(response.data.message || "그룹 조회 실패");
    }

    return response.data.data.groups;
  } catch (error) {
    console.error(
      "❌ 그룹 리스트 조회 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ 새 그룹 생성 API 요청 함수
export const createGroup = async (groupName) => {
  try {
    const response = await groupClient.post("/groups/new", { groupName });

    if (!response.data.success) {
      throw new Error(response.data.message || "그룹 생성 실패");
    }

    return response.data.data;
  } catch (error) {
    console.error("❌ 그룹 생성 실패:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 그룹 이름 변경 API 요청 함수
export const updateGroupName = async (groupId, newGroupName) => {
  try {
    const response = await groupClient.patch(`/groups/${groupId}`, {
      groupName: newGroupName,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "그룹 이름 변경 실패");
    }

    // ✅ 응답 구조가 다를 가능성을 대비해 안전하게 접근
    return (
      response.data.data?.group || response.data.data?.groupName || newGroupName
    );
  } catch (error) {
    console.error(
      "❌ 그룹 이름 변경 실패:",
      error.response?.data || error.message
    );
    throw error; // Redux에서 에러를 처리할 수 있도록 다시 던짐
  }
};

// ✅ 그룹 나가기 API 요청 함수
export const leaveGroup = async (groupId) => {
  try {
    const response = await groupClient.post(`/groups/left/${groupId}`);

    if (!response.data.success) {
      throw new Error(response.data.message || "그룹 나가기 실패");
    }

    return response.data; // 성공 시 반환
  } catch (error) {
    console.error(
      "❌ 그룹 나가기 실패:",
      error.response?.data || error.message
    );
    throw error; // Redux에서 처리할 수 있도록 예외 던짐
  }
};
