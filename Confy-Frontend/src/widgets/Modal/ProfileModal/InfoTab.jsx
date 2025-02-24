import React, { useState } from "react";
import style from "../../Modal/ProfileModal/style/ProfileModal.module.css";
import icons from "../../../shared/icons/index";

function InfoTab({ user, onClose }) {
  return (
    <div className={style.main}>
      <div className={style.mainTitle}>
        서비스 정보
        <div>
          <button onClick={onClose}>
            <img src={icons.cross.default} alt="close" />
          </button>
        </div>
      </div>

      <div className={style.mainList}>
        {/* 🔹 서비스 소개 */}
        <div className={style.mainListTitle}>Confy란?</div>
        <div className={style.subtext}>
          Confy는 실시간 회의 요약 및 시각화를 제공하는 서비스입니다. WebRTC를
          기반으로 화상회의 기능을 지원하며, STT를 활용한 회의 자동 요약을
          제공합니다.
        </div>

        {/* 🔹 버전 정보 */}
        <div className={style.content}>
          <label>버전</label>
          <span>1.0.0</span>
        </div>

        {/* 🔹 개발 팀 정보 */}
        <div className={style.content}>
          <label>개발팀</label>
          <span>SSAFY 12기 A508 Team</span>
        </div>

        {/* 🔹 문의 정보 */}
        <div className={style.content}>
          <label>문의하기</label>
          <span>
            <a href="mailto:support@confy.io">confya508@gmail.com</a>
          </span>
        </div>

        {/* 🔹 이용 약관 & 개인정보 처리방침 */}
        <div className={style.content}>
          <label>이용 약관</label>
          <span>
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              약관 보기
            </a>
          </span>
        </div>

        <div className={style.content}>
          <label>개인정보 처리방침</label>
          <span>
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              개인정보 처리방침 보기
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
export default InfoTab;
