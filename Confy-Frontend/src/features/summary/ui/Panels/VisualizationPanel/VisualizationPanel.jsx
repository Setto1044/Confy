import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactFlow, { Background, Handle } from "reactflow";
import "reactflow/dist/style.css";
import { BeatLoader } from "react-spinners";
import Button from "../../../../../widgets/Button/Button";
import styles from "./VisualizationPanel.module.css";
import editVisualizationApi from "../../../../edit-visualization/api/editVisualizationApi";
import { useMutation } from "@tanstack/react-query";

// ✅ Custom Node Components 추가 (기본적인 스타일 제공)
const OpinionNode = ({ data }) => (
  <div
    style={{
      padding: 10,
      backgroundColor: "#f0f0f0",
      border: "1px solid #333",
      borderRadius: 5,
    }}
  >
    <Handle type="target" position="top" />
    <div>{data.label}</div>
    <Handle type="source" position="bottom" />
  </div>
);

const TopicNode = ({ data }) => (
  <div
    style={{
      padding: 10,
      backgroundColor: "#d1e8ff",
      border: "1px solid #333",
      borderRadius: 5,
    }}
  >
    <Handle type="target" position="top" />
    <div>{data.label}</div>
    <Handle type="source" position="bottom" />
  </div>
);

// ✅ Node Type 정의
const nodeTypes = {
  opinion: OpinionNode,
  topic: TopicNode,
};

const VisualizationPanel = ({ visualizationData }) => {
  const navigate = useNavigate();
  const { meetingId: paramMeetingId } = useParams();
  const meetingId = visualizationData?.meetingId || paramMeetingId;

  const { mutate: fetchVisualizationData, isLoading } = useMutation({
    mutationFn: () => editVisualizationApi.fetchVisualizationData(meetingId),
    onSuccess: () => {
      if (visualizationData) {
        // console.log("🚀 수정 페이지로 이동 전 데이터 유지:", visualizationData);
      }

      navigate(`/meetings/${meetingId}/edit-visualization`, {
        state: { visualizationData, meetingId },
      });
    },
    onError: (error) => {
      console.error("❌ 회의 수정 요청 실패:", error);
      alert(error.response?.data?.message || "회의 수정 요청 실패");
    },
  });

  // ✅ ReactFlow에 맞게 데이터 변환
  const flowElements = useMemo(() => {
    if (!visualizationData?.data) return { nodes: [], edges: [] };

    const nodes =
      visualizationData.data.nodes?.map((item) => ({
        id: item.id,
        data: { label: item.data.label || item.data.idea }, // ✅ label을 우선 사용, 없으면 idea 사용
        position: item.position || { x: 0, y: 0 }, // ✅ position이 없으면 기본값 설정
        type: item.type || "default", // ✅ type이 없으면 기본값 설정
      })) || [];

    const edges =
      visualizationData.data.edges?.map((relation) => ({
        id: relation.id,
        source: relation.source,
        target: relation.target,
        type: "smoothstep", // ✅ ReactFlow에서 자연스러운 연결을 위해 "smoothstep" 사용
      })) || [];

    // console.log("✅ ReactFlow에 전달할 nodes:", nodes);
    // console.log("✅ ReactFlow에 전달할 edges:", edges);

    return { nodes, edges };
  }, [visualizationData]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {!visualizationData?.data ? (
          <div className="flex flex-col items-center justify-center gap-2 h-full text-center">
            <p className="text-gray-600">시각화 데이터를 생성 중입니다...</p>
            <BeatLoader color="#2172F6" size={15} speedMultiplier={0.8} />
          </div>
        ) : (
          <div className={styles.flowWrapper}>
            <ReactFlow
              nodes={flowElements.nodes}
              edges={flowElements.edges}
              fitView
              nodeTypes={nodeTypes}
            >
              <Background />
            </ReactFlow>
          </div>
        )}
      </div>

      {visualizationData?.data && (
        <div className={styles.fixedButtonContainer}>
          <Button
            className={styles.editButton}
            onClick={() => fetchVisualizationData()}
            disabled={isLoading}
          >
            {isLoading ? "확인 중..." : "수정"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default VisualizationPanel;
