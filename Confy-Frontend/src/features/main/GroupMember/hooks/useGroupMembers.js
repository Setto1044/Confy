import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { fetchGroupMembers, inviteGroupMembers } from "../api/groupMemberApi";

const useGroupMembers = (groupId) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!groupId) return;

    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const memberData = await fetchGroupMembers(groupId);
        setMembers(memberData);
      } catch (error) {
        setError(error.message || "그룹 멤버 조회 실패");
        toast.error("그룹 멤버 조회에 실패했습니다."); // 에러 메시지 추가
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [groupId]);

  const invite = async (userEmails) => {
    if (!userEmails.length) {
      toast.warn("초대할 이메일을 입력해주세요."); // 경고 메시지 추가
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await inviteGroupMembers(groupId, userEmails);
      toast.success("초대가 완료되었습니다!");
      const updatedMembers = await fetchGroupMembers(groupId);
      setMembers(updatedMembers);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "초대에 실패했습니다.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { members, invite, isLoading, error };
};

export default useGroupMembers;
