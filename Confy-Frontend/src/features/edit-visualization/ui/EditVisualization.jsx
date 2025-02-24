import React, { useMemo, useRef } from "react";
import html2canvas from "html2canvas"; // html2canvas 추가
import { useUpdateVisualization } from "../hooks/useUpdateVisualization";
import { useVisualizationEditor } from "../hooks/useVisualizationEditor";
import NodeEditInput from "./ReactFlow/NodeEditInput";
import Button from "../../../widgets/Button/Button";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";
import styles from "./EditVisualization.module.css";
import { useDispatch } from "react-redux";
import { updateMeetingThumbnail } from "../../../shared/store/meetingSlice";

// ✅ SummaryPage에서 사용한 커스텀 노드 스타일 가져오기
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

const Flow = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeDoubleClick,
  editingNodeId,
  inputValue,
  handleInputChange,
  handleInputBlur,
  inputPosition,
}) => {
  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes} // 커스텀 노드
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: true,
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        className={styles.reactFlowWrapper}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {editingNodeId && inputPosition && (
        <NodeEditInput
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          handleInputBlur={handleInputBlur}
          inputPosition={inputPosition}
        />
      )}
    </>
  );
};

const EditVisualization = ({ data, meetingId, onEditComplete }) => {
  const reactFlowWrapper = useRef(null);
  const dispatch = useDispatch();

  const parsedData = useMemo(() => {
    if (!data) return { nodes: [], edges: [] };

    try {
      const rawData = typeof data === "string" ? JSON.parse(data) : data;
      return typeof rawData.data === "string"
        ? JSON.parse(rawData.data)
        : rawData.data;
    } catch (error) {
      console.error("JSON 파싱 오류:", error);
      return { nodes: [], edges: [] };
    }
  }, [data]);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    editingNodeId,
    inputValue,
    handleNodeDoubleClick,
    inputPosition,
    handleInputChange,
    handleInputBlur,
  } = useVisualizationEditor(parsedData);

  const { mutate, isLoading } = useUpdateVisualization(meetingId, {
    onSuccess: () => {
      console.log("수정 성공! 요약 페이지로 이동");
      onEditComplete();
    },
    onError: (error) => {
      alert(error.response?.data?.message || "저장 실패");
    },
  });

  // 이미지 캡처 및 다운로드
  const handleCaptureAndDownload = async () => {
    if (!reactFlowWrapper.current) {
      alert("캡처할 영역을 찾을 수 없습니다.");
      return;
    }

    try {
      // ✅ 캡처 실행 전에 리렌더링 지연
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // ✅ 캡처 수행
      const canvas = await html2canvas(reactFlowWrapper.current, {
        scale: 2, // 해상도 증가
        backgroundColor: "#ffffff",
        useCORS: true, // 외부 리소스 문제 해결
      });

      const image = canvas.toDataURL("image/png"); // PNG 변환
      console.log("📌 저장할 summaryImagePath:", image); // ✅ 디버깅 추가

      // ✅ Redux에 업데이트 후 리렌더링 보장
      dispatch(updateMeetingThumbnail({ meetingId, summaryImagePath: image }));

      setTimeout(() => {
        console.log("📌 Redux 상태 업데이트 확인:", meetingId); // ✅ Redux 상태 업데이트 확인
        window.dispatchEvent(new Event("thumbnailUpdated")); // ✅ UI 강제 업데이트
      }, 200);

      // ✅ 로컬 다운로드
      const link = document.createElement("a");
      link.href = image;
      link.download = "visualization.png";
      link.click();
    } catch (error) {
      console.error("이미지 캡처 오류:", error);
      alert("이미지 캡처에 실패했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.flowContainer} ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <Flow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDoubleClick={handleNodeDoubleClick}
            editingNodeId={editingNodeId}
            inputValue={inputValue}
            handleInputChange={handleInputChange}
            handleInputBlur={handleInputBlur}
            inputPosition={inputPosition}
          />
        </ReactFlowProvider>
      </div>

      <div className={styles.buttonContainer}>
        <Button
          onClick={() => {
            mutate({ nodes, edges });
          }}
          className={styles.button}
          disabled={isLoading}
        >
          {isLoading ? "저장 중..." : "저장"}
        </Button>

        <Button
          onClick={handleCaptureAndDownload}
          className={styles.button}
          id="download-btn"
        >
          이미지 저장
        </Button>
      </div>
    </div>
  );
};

export default EditVisualization;
