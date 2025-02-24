import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeetings } from "../../../../shared/store/meetingSlice.js";

const LOAD_MORE_COUNT = 10;

const useMeetingList = () => {
  const dispatch = useDispatch();
  const {
    meetings,
    loading,
    cursor,
    hasMoreItems,
    selectedFilter,
    selectedGroup,
  } = useSelector((state) => state.meeting);

  useEffect(() => {
    if (meetings.length === 0 && hasMoreItems) {
      let type = "all";
      let groupId = null;

      if (selectedFilter === "group") {
        type = "group";
        groupId = Number(selectedGroup);
      } else if (selectedFilter === "starred") {
        type = "favorite";
      }

      dispatch(fetchMeetings({ type, groupId, cursor: null, size: 20 }));
    }
  }, [dispatch, meetings.length, hasMoreItems, selectedFilter, selectedGroup]);

  const loadMoreItems = useCallback(() => {
    if (loading || !hasMoreItems || cursor === null) return;

    let type = "all";
    let groupId = null;

    if (selectedFilter === "group") {
      type = "group";
      groupId = Number(selectedGroup);
    } else if (selectedFilter === "starred") {
      type = "favorite";
    }

    dispatch(fetchMeetings({ type, groupId, cursor, size: LOAD_MORE_COUNT }));
  }, [cursor, dispatch, loading, hasMoreItems, selectedFilter, selectedGroup]);
  return {
    meetings,
    loading,
    loadMoreItems,
    hasMoreItems,
  };
};

export default useMeetingList;
