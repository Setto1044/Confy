import apiClient from "./apiClient/authClient";

const authApi = {
  // ✅ 회원가입
  signup: async (fullName, email, password) => {
    try {
      const response = await apiClient.post("/users/join", {
        fullName,
        email, // 사용자 ID = 이메일
        password,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "회원가입 중 오류가 발생했습니다.",
      };
    }
  },

  // ✅ 로그인
  login: async (email, password) => {
    try {
      const response = await apiClient.post("/users/login", {
        email,
        password,
      });

      let responseData = response.data;
      if (typeof responseData === "string") {
        responseData = JSON.parse(responseData);
      }

      // 토큰 저장
      if (responseData.success) {
        const token = responseData.data.token;
        localStorage.setItem("accessToken", token);
      }

      return responseData;
    } catch (error) {
      console.error("❌ 로그인 요청 오류:", error.response || error);
      return {
        success: false,
        message:
          error.response?.data?.message || "로그인 중 오류가 발생했습니다.",
      };
    }
  },
  // ✅ 로그아웃
  logout: async () => {
    try {
      const response = await apiClient.post("/users/logout");

      if (response.data.success) {
        localStorage.removeItem("accessToken"); // 토큰 삭제
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "로그아웃 중 오류가 발생했습니다.",
      };
    }
  },
  // ✅ 내 정보 조회
  getUserInfo: async () => {
    try {
      const token = localStorage.getItem("accessToken"); // 토큰 가져오기
      if (!token) throw new Error("인증 토큰이 없습니다.");

      const response = await apiClient.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("❌ 내 정보 조회 오류:", error.response || error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "회원 정보 조회 중 오류가 발생했습니다.",
      };
    }
  },
  // ✅ 프로필 이미지 업로드
  updateProfileImage: async (formData) => {
    try {
      const response = await apiClient.patch(
        "/users/me/profile-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ 프로필 이미지 업데이트 실패:", error);
      return { success: false, message: "이미지 업데이트 중 오류 발생" };
    }
  },

  // ✅ 🔥 프로필 이미지 조회 (authClient 사용)
  getProfileImage: async (profileUrl) => {
    try {
      // 절대 URL인 경우 API 요청을 건너뛰고 바로 반환
      if (profileUrl.startsWith("http")) {
        return profileUrl;
      }

      // 상대 경로이면 API 호출
      const response = await apiClient.get(`/images/${profileUrl}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("❌ 프로필 이미지 불러오기 실패:", error);
      return null;
    }
  },
  // ✅ 미팅 시작 알림 설정 API 추가
  updateMeetingNotification: async (isMeetingAlertOn) => {
    try {
      const response = await apiClient.patch("/users/me/notification/meeting", {
        isMeetingAlertOn,
      });

      return response.data;
    } catch (error) {
      console.error("❌ 미팅 알림 설정 업데이트 실패:", error);
      return {
        success: false,
        message: "미팅 알림 설정 중 오류 발생",
      };
    }
  },
};

export default authApi;
