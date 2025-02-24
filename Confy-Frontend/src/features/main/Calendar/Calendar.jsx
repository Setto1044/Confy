import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import styles from "../Calendar/Calendar.module.css";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import icons from "../../../shared/icons";

const MyCalendar = ({ meetingList, onClose }) => {
  const [date, setDate] = useState(new Date());
  const [meetings, setMeetings] = useState([]);

  const formatMeetingsData = () => {
    const formattedData = {};

    meetingList.forEach((meeting) => {
      // ✅ startedAt 기준으로 시간 변환
      const meetingDate = new Date(meeting.startedAt);
      meetingDate.setHours(meetingDate.getHours() + 9); // ✅ 한국 시간 적용

      const dateKey = moment(meetingDate).format("YYYY-MM-DD");
      const time = moment(meetingDate).format("HH:mm");

      if (!formattedData[dateKey]) {
        formattedData[dateKey] = [];
      }

      formattedData[dateKey].push({ time: time, title: meeting.meetingName });
    });

    return formattedData;
  };

  const meetingsData = formatMeetingsData();
  const formattedDate = moment(date).format("YYYY-MM-DD");

  useEffect(() => {
    setMeetings(meetingsData[formattedDate] || []);
  }, [date, meetingList]);

  const CustomNavigation = ({ date, onClickPrev, onClickNext }) => (
    <div className={styles.monthSelector}>
      <div className={styles.monthSelectorDate}>
        {moment(date).format("YYYY.MM")} {/* 날짜 포맷 변경 */}
      </div>
      <div className={styles.arrow}>
        <button onClick={onClickPrev}>
          <img src={icons.angleSmallLeft} alt="" />
        </button>
        <button onClick={onClickNext}>
          <img src={icons.angleSmallRight} alt="" />
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.leftbar}>
      <div className={styles.calendar}>
        <CustomNavigation
          date={date}
          onClickPrev={() =>
            setDate(moment(date).subtract(1, "month").toDate())
          }
          onClickNext={() => setDate(moment(date).add(1, "month").toDate())}
        />

        <div className={styles.calendarEvent}>
          <Calendar
            onChange={setDate}
            value={date}
            locale="ko-KR"
            showNavigation={false}
            formatShortWeekday={(locale, date) =>
              ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
            }
            formatDay={(locale, date) => moment(date).format("D")}
            tileContent={({ date }) => {
              const formattedTileDate = moment(date).format("YYYY-MM-DD");
              const hasMeeting = meetingsData[formattedTileDate];

              return hasMeeting ? (
                <div className={styles.dotContainer}>
                  <div className={styles.dot}></div>
                </div>
              ) : null;
            }}
          />

          <div className={styles.meetingDate}>회의 일정</div>
          <div className={styles.calendarList}>
            {meetings.length > 0 ? (
              meetings.map((meeting, index) => (
                <div key={index} className={styles.event}>
                  <div className={styles.meetingTime}>
                    <img src={icons.alarm.default} alt="" />
                    <div>{meeting.time}</div>
                  </div>
                  <div>{meeting.title}</div>
                </div>
              ))
            ) : (
              <p>오늘은 회의가 없습니다</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;
