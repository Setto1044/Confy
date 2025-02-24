import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleCheck,
  toggleStar,
  clearCheckedItems,
} from "../../../../shared/store/meetingSlice.js";
import useMeetingList from "../hooks/useMeetingList.js";
import MeetingItem from "./MeetingItem";
import MeetingListHeader from "./MeetingListHeader.jsx";
import MeetingGallery from "./MeetingGallery";
import styles from "./MeetingList.module.css";
import icons from "../../../../shared/icons/index.js";

const MeetingList = () => {
  const { meetings, loadMoreItems, hasMoreItems } = useMeetingList();
  const dispatch = useDispatch();

  // Redux 상태 가져오기
  const selectedFilter = useSelector((state) => state.meeting.selectedFilter);
  const selectedGroup = useSelector((state) => state.meeting.selectedGroup);
  const checkedItems = useSelector((state) => state.meeting.checkedItems);
  const starredItems = useSelector((state) => state.meeting.starredItems);
  const searchQuery = useSelector((state) => state.meeting.searchQuery);

  // 필터링된 회의 목록
  const filteredMeetings = useMemo(() => {
    let result = [...meetings];

    if (selectedFilter === "all") {
      return meetings;
    }
    if (selectedFilter === "starred") {
      return meetings.filter((meeting) => starredItems.includes(meeting.id));
    }
    if (selectedFilter === "group") {
      return meetings.filter(
        (meeting) => meeting.groupId === Number(selectedGroup)
      );
    }
    // ✅ 검색어 적용 (검색어가 존재하는 경우)
    if (searchQuery.trim() !== "") {
      result = result.filter((meeting) =>
        meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return meetings;
  }, [selectedFilter, selectedGroup, meetings, starredItems, searchQuery]);

  const [viewType, setViewType] = useState("list");

  const isItemLoaded = useCallback(
    (index) => index < filteredMeetings.length,
    [filteredMeetings]
  );

  const handleCheck = useCallback(
    (meetingId, isChecked) => {
      dispatch(toggleCheck({ meetingId, isChecked }));
    },
    [dispatch]
  );

  const handleStar = useCallback(
    (meetingId, isStarred) => {
      dispatch(toggleStar({ meetingId, isStarred }));
    },
    [dispatch]
  );

  const handleDelete = useCallback(() => {
    dispatch(clearCheckedItems());
  }, [dispatch]);

  const renderItem = useCallback(
    ({ index, style }) => {
      if (!filteredMeetings[index]) return null;
      return (
        <div style={style}>
          <MeetingItem
            key={filteredMeetings[index].id}
            meeting={filteredMeetings[index]}
            onStar={handleStar}
            onCheck={handleCheck}
            isChecked={checkedItems.includes(filteredMeetings[index].id)}
            isStarred={starredItems.includes(filteredMeetings[index].id)}
          />
        </div>
      );
    },
    [filteredMeetings, handleStar, handleCheck, checkedItems, starredItems]
  );

  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      const scrollElement = listRef.current;
      scrollElement.style.scrollbarWidth = "thin";
      scrollElement.style.scrollbarColor = "#e2e2e2 transparent";
    }
  }, []);

  return (
    <div className={styles.meetingList}>
      <MeetingListHeader
        selectedGroup={selectedGroup}
        checkedItems={checkedItems}
        onDelete={handleDelete}
        viewType={viewType}
        setViewType={setViewType}
      />

      {viewType === "list" ? (
        <>
          <div className={styles.listHeader}>
            <div className={styles.listIcon}>
              <img src={icons.checkbox.default} alt="checkbox" />
              <img src={icons.star.default} alt="star" />
            </div>
            <div className={styles.listHeaderTitle}>회의 제목</div>
            <div className={styles.listHeaderGroup}>그룹</div>
            <div className={styles.listHeaderDate}>생성일</div>
          </div>

          <div className={styles.listView}>
            <AutoSizer>
              {({ height, width }) => (
                <InfiniteLoader
                  isItemLoaded={isItemLoaded}
                  itemCount={
                    hasMoreItems
                      ? filteredMeetings.length + 1
                      : filteredMeetings.length
                  }
                  loadMoreItems={loadMoreItems}
                  threshold={5}
                >
                  {({ onItemsRendered, ref }) => (
                    <List
                      height={height}
                      itemCount={filteredMeetings.length}
                      itemSize={80}
                      onItemsRendered={onItemsRendered}
                      ref={ref}
                      outerRef={listRef}
                      width={width}
                    >
                      {renderItem}
                    </List>
                  )}
                </InfiniteLoader>
              )}
            </AutoSizer>
          </div>
        </>
      ) : (
        <MeetingGallery
          meetings={filteredMeetings}
          onCheck={handleCheck}
          onStar={handleStar}
          checkedItems={checkedItems}
          starredItems={starredItems}
        />
      )}
    </div>
  );
};

export default MeetingList;
