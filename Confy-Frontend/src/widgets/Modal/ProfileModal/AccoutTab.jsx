import React, { useState, useEffect } from "react";
import style from "../../Modal/ProfileModal/style/ProfileModal.module.css";
import authApi from "../../../shared/api/authApi";
import { useDispatch } from "react-redux";
import { login } from "../../../shared/store/authSlice";
import icons from "../../../shared/icons/index";
import useProfileImage from "../../../shared/hooks/useProfileImage";
import { API_BASE_URL } from "../../../shared/config/config";

function AccountTab({ user, onClose }) {
  const dispatch = useDispatch();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const defaultProfileImage = "/assets/images/default-profile.png";

  const profileImage = useProfileImage(); // ✅ 저장된 최종 프로필 이미지
  const [previewUrl, setPreviewUrl] = useState(null); // ✅ 미리보기 이미지
  const [selectedFile, setSelectedFile] = useState(null); // ✅ 선택한 파일
  const [isSaved, setIsSaved] = useState(false); // ✅ 저장 버튼을 눌렀는지 여부

  const [userData, setUserData] = useState(user || {});

  // ✅ 인증 헤더를 포함한 프로필 이미지 요청 함수
  const fetchProfileImage = async () => {
    try {
      const imageUrl = await authApi.getProfileImage(user.profileUrl);
      if (imageUrl) {
        setPreviewUrl(imageUrl);
      }
    } catch (error) {
      console.error("❌ 프로필 이미지 불러오기 실패:", error);
      setPreviewUrl(defaultProfileImage);
    }
  };

  useEffect(() => {
    if (!selectedFile && !isSaved) {
      setPreviewUrl(profileImage); // 파일 선택이 없고, 저장도 안 한 경우 기본 이미지 유지
    }
  }, [profileImage, selectedFile, isSaved]);

  const handleImageError = (event) => {
    event.target.onerror = null;
    setPreviewUrl(defaultProfileImage);
  };

  // ✅ 파일 선택 시 미리보기 활성화
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // 미리보기 즉시 업데이트
      setIsSaved(false); // 저장 상태 해제
    }
  };

  // ✅ 프로필 이미지 업로드
  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("profileImg", selectedFile);

    try {
      const response = await authApi.updateProfileImage(formData);
      if (response.success) {
        let newProfileUrl = response.data.profileUrl;

        // profileUrl이 상대 경로라면 절대 경로로 변환
        if (!newProfileUrl.startsWith("http")) {
          newProfileUrl = `${API_BASE_URL}/images/${newProfileUrl}`;
        }

        dispatch(login({ ...user, profileUrl: newProfileUrl }));
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setSelectedFile(null);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("❌ 프로필 이미지 업로드 실패:", error);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(profileImage);
    setSelectedFile(null);
    setIsSaved(false);
  };

  return (
    <div className={style.main}>
      <div className={style.mainTitle}>
        내 계정
        <div>
          <button onClick={onClose}>
            <img src={icons.cross.default} alt="close" />
          </button>
        </div>
      </div>
      <div className={style.mainList}>
        <div className={style.mainListTitle}>기본 정보</div>

        {/* 프로필 이미지 */}
        <div className={style.mainListProfile}>
          <label>프로필</label>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="profile-upload"
            />
            <label htmlFor="profile-upload">
              <img
                src={previewUrl}
                alt="프로필 이미지"
                onError={handleImageError}
              />
            </label>
            <div className={style.mainListButton}>
              <button onClick={handleUpload}>저장</button>
              <button>삭제</button>
            </div>
          </div>
        </div>

        {/* 이름 */}
        <div className={style.maintListItem}>
          <label>이름</label>
          <input
            type="text"
            value={userData?.fullName || ""}
            readOnly
            onFocus={() => setIsEditingName(true)}
            onBlur={() => setTimeout(() => setIsEditingName(false), 200)}
          />
          <div
            className={style.mainListButton}
            style={{ visibility: isEditingName ? "visible" : "hidden" }}
          >
            <button>확인</button>
            <button onClick={() => setIsEditingName(false)}>취소</button>
          </div>
        </div>

        {/* 이메일 */}
        <div className={style.maintListItem}>
          <label>이메일(ID)</label>
          <input
            type="email"
            value={userData?.email || ""}
            readOnly
            onFocus={() => setIsEditingEmail(true)}
            onBlur={() => setTimeout(() => setIsEditingEmail(false), 200)}
          />
          <div
            className={style.mainListButton}
            style={{ visibility: isEditingEmail ? "visible" : "hidden" }}
          >
            <button>확인</button>
            <button onClick={() => setIsEditingEmail(false)}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountTab;
