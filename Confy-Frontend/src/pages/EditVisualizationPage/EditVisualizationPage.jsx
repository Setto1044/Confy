import React from "react";
import SummaryInfoHeader from "../../features/summary/ui/SummaryInfoHeader";
import EditVisualization from "../../features/edit-visualization/ui/EditVisualization";
import SummaryHeader from "../../widgets/Header/SummaryHeader";

const EditVisualizationPage = () => {
  return (
    <>
      <SummaryHeader/>
      <div>
      <SummaryInfoHeader />
        <EditVisualization />
      </div>
    </>
  );
};

export default EditVisualizationPage;
