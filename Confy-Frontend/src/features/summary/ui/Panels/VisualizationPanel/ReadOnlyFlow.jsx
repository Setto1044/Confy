import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";

const ReadOnlyFlow = ({ nodes, edges }) => (
  <div className="w-full h-full border rounded-lg">
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
      attributionPosition="bottom-right"
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
    >
      <Background />
    </ReactFlow>
  </div>
);

export default ReadOnlyFlow;
