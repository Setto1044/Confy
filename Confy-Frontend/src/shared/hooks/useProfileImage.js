import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import authApi from "../api/authApi";

const useProfileImage = () => {
  const user = useSelector((state) => state.auth.user);
  const defaultProfileImage = "/assets/images/default-profile.png";
  const [profileImage, setProfileImage] = useState(defaultProfileImage);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user?.profileUrl) {
        try {
          const imageUrl = await authApi.getProfileImage(user.profileUrl);
          if (imageUrl) {
            setProfileImage(imageUrl);
          }
        } catch (error) {
          console.error("❌ 프로필 이미지 로드 실패:", error);
          setProfileImage(defaultProfileImage);
        }
      } else {
        setProfileImage(defaultProfileImage);
      }
    };

    fetchProfileImage();
  }, [user?.profileUrl]);

  return profileImage;
};

export default useProfileImage;
