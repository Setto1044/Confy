import { useState, useCallback, useEffect } from "react";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "reactflow";

export const useVisualizationEditor = (visual) => {
  const [nodes, setNodes] = useState(visual?.nodes ?? []);
  const [edges, setEdges] = useState(visual?.edges ?? []);
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 }); // ✅ inputPosition 기본값 추가

  useEffect(() => {
    if (visual) {
      setNodes(visual.nodes ?? []);
      setEdges(visual.edges ?? []);
    }
  }, [visual]);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds = []) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((params) => {
    setEdges((eds = []) => addEdge(params, eds)); // 기본값을 빈 배열로 설정
  }, []);

  const handleNodeDoubleClick = useCallback((event, node) => {
    if (!node || !node.position) return; // ✅ 노드가 없을 경우 방어 로직 추가

    setEditingNodeId(node.id);
    setInputValue(node.data?.label ?? ""); // ✅ node.data.label이 없을 경우 기본값 ""

    // ✅ 클릭한 노드의 위치를 기반으로 입력창 배치
    setInputPosition({
      x: node.position.x + 100,
      y: node.position.y,
    });
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputBlur = () => {
    if (editingNodeId === null) return;

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === editingNodeId
          ? { ...node, data: { ...node.data, label: inputValue } }
          : node
      )
    );

    setEditingNodeId(null);
  };

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    editingNodeId,
    inputValue,
    inputPosition,
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleNodeDoubleClick,
    handleInputChange,
    handleInputBlur,
  };
};
