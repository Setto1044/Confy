import React, { useState, useCallback, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import MeetingGalleryItem from "./MeetingGalleryItem";
import styles from "./MeetingGallery.module.css";
import { toggleCheck, toggleStar } from "../../../../shared/store/meetingSlice";
import useMeetingList from "../hooks/useMeetingList.js"; // ✅ useMeetingList 활용

const LOAD_MORE_COUNT = 10;
const LOADING_DELAY = 1000;

const MeetingGallery = () => {
  const dispatch = useDispatch();
  const loadingTimeoutRef = useRef(null);
  const isLoadingRef = useRef(false);

  // ✅ useMeetingList 훅 사용하여 meetings 가져오기
  const { meetings, loadMoreItems, hasMoreItems } = useMeetingList();

  // Redux state selectors
  const selectedFilter = useSelector((state) => state.meeting.selectedFilter);
  const selectedGroup = useSelector((state) => state.meeting.selectedGroup);
  const checkedItems = useSelector((state) => state.meeting.checkedItems);
  const starredItems = useSelector((state) => state.meeting.starredItems);

  // ✅ 필터링된 회의 목록 계산 (전체, 즐겨찾기, 특정 그룹 필터 적용)
  const filteredMeetings = useMemo(() => {
    if (selectedFilter === "all") return meetings;
    if (selectedFilter === "starred") {
      return meetings.filter((meeting) => starredItems.includes(meeting.id));
    }
    if (selectedFilter === "group") {
      return meetings.filter((meeting) => meeting.groupId === selectedGroup);
    }
    return meetings;
  }, [selectedFilter, selectedGroup, meetings, starredItems]);

  // ✅ 이미지 로드 상태 관리
  const [loadedImages, setLoadedImages] = useState({});
  const [errorImages, setErrorImages] = useState({});

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

  return (
    <AutoSizer>
      {({ height, width }) => {
        const columnCount = Math.max(Math.floor(width / 250), 1);
        const itemWidth = width / columnCount - 16;

        return (
          <div className={styles.galleryContainer} style={{ height, width }}>
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
                <div className={styles.galleryWrapper} ref={ref}>
                  {filteredMeetings.map((meeting) => (
                    <MeetingGalleryItem
                      key={meeting.id}
                      meeting={meeting}
                      isChecked={checkedItems.includes(meeting.id)}
                      isStarred={starredItems.includes(meeting.id)}
                      onCheck={handleCheck}
                      onStar={handleStar}
                      loadedImages={loadedImages}
                      errorImages={errorImages}
                      itemWidth={itemWidth}
                    />
                  ))}
                </div>
              )}
            </InfiniteLoader>
          </div>
        );
      }}
    </AutoSizer>
  );
};

export default MeetingGallery;
