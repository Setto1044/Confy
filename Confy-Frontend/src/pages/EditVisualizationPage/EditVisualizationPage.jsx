import React from "react";
import EditVisualization from "../../features/edit-visualization/ui/EditVisualization";
import SummaryHeader from "../../widgets/Header/SummaryHeader";

const EditVisualizationPage = () => {
  return (
    <>
      <SummaryHeader/>
      <div className="p-4">
        <h2 className="text-lg font-bold">시각화 편집</h2>
        <EditVisualization />
      </div>
    </>
  );
};

export default EditVisualizationPage;
