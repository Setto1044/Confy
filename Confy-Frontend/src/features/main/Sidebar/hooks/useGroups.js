import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchGroups,
  addGroup,
  editGroupName,
  removeGroup,
} from "../../../../shared/store/groupSlice"; // Redux 액션 import

const useGroups = () => {
  const dispatch = useDispatch();

  // Redux 상태 가져오기
  const groups = useSelector((state) => state.group.groups);
  const isLoading = useSelector((state) => state.group.loading);
  const error = useSelector((state) => state.group.error);

  // ✅ 그룹 목록 불러오기 (Redux 상태 사용)
  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const addNewGroup = async (groupName) => {
    if (!groupName.trim()) return;
    try {
      await dispatch(addGroup(groupName)).unwrap();
      dispatch(fetchGroups()); // ✅ 그룹 추가 후 다시 목록 불러오기
      toast.success("그룹이 성공적으로 생성되었습니다!");
    } catch (error) {
      toast.error("그룹 생성에 실패했습니다.");
      throw error;
    }
  };

  const updateGroup = async (groupId, newName) => {
    if (!newName.trim()) return;

    try {
      // ✅ 1️⃣ 변경할 그룹을 찾아서 직접 상태 업데이트 (Optimistic UI)
      dispatch(editGroupName({ groupId, newGroupName: newName })); // 임시로 상태 변경

      // ✅ 2️⃣ 백엔드 API 호출
      await dispatch(
        editGroupName({ groupId, newGroupName: newName })
      ).unwrap();

      // ✅ 3️⃣ API 호출 후, 다시 전체 그룹 목록 불러오기 (정확한 데이터 보장)
      dispatch(fetchGroups());

      toast.success("그룹 이름이 변경되었습니다!");
    } catch (error) {
      toast.error("그룹 이름 변경에 실패했습니다.");

      // 실패 시, 원래 상태로 복구 (Optimistic UI 롤백)
      dispatch(fetchGroups());
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      await dispatch(removeGroup(groupId)).unwrap();
      dispatch(fetchGroups()); // ✅ 삭제 후 다시 목록 불러오기
      toast.success("그룹이 성공적으로 삭제되었습니다.");
    } catch (error) {
      toast.error("그룹 삭제에 실패했습니다.");
      throw error;
    }
  };

  return {
    groups,
    isLoading,
    error,
    addNewGroup,
    updateGroup,
    deleteGroup,
  };
};

export default useGroups;
