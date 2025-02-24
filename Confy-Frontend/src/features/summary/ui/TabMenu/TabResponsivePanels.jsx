import styles from "./TabResponsivePanels.module.css";
import { useState } from "react";
import TabMenu from "./TabMenu";
import ScriptPanel from "../Panels/ScriptPanel/ScriptPanel";
import SummaryPanel from "../Panels/SummaryPanel/SummaryPanel";
import VisualizationPanel from "../Panels/VisualizationPanel/VisualizationPanel";

const TabResponsivePanels = ({
  scriptData,
  summaryData,
  refetchSummary,
  visualizationData,
  refetchVisualization,
  meetingId,
}) => {
  const [mobileTab, setMobileTab] = useState("시각화");
  const [rightTab, setRightTab] = useState("시각화");

  return (
    <div className={styles.container}>
      {/* 모바일 뷰 */}
      <div className={styles.mobileView}>
        <TabMenu activeTab={mobileTab} setActiveTab={setMobileTab} />
        <div className={styles.panel}>
          {mobileTab === "스크립트" && (
            <ScriptPanel scriptData={scriptData} meetingId={meetingId} />
          )}
          {mobileTab === "시각화" && (
            <VisualizationPanel
              visualizationData={visualizationData}
              refetchVisualization={refetchVisualization}
            />
          )}
          {mobileTab === "요약정리" && (
            <SummaryPanel
              summaryData={summaryData}
              refetchSummary={refetchSummary}
              meetingId={meetingId}
            />
          )}
        </div>
      </div>

      {/* 데스크톱 뷰 */}
      <div className={styles.desktopView}>
        {/* 왼쪽 패널 (스크립트) */}
        <div className={styles.leftPanel}>
          <TabMenu activeTab="스크립트" setActiveTab={() => {}} leftOnly />
          <div className={styles.panel}>
            <ScriptPanel scriptData={scriptData} meetingId={meetingId} />
          </div>
        </div>

        {/* 오른쪽 패널 (시각화/요약정리) */}
        <div className={styles.rightPanel}>
          <TabMenu activeTab={rightTab} setActiveTab={setRightTab} rightOnly />
          <div className={styles.panel}>
            {rightTab === "시각화" && (
              <VisualizationPanel
                visualizationData={visualizationData}
                refetchVisualization={refetchVisualization}
              />
            )}
            {rightTab === "요약정리" && (
              <SummaryPanel
                summaryData={summaryData}
                refetchSummary={refetchSummary}
                meetingId={meetingId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabResponsivePanels;
