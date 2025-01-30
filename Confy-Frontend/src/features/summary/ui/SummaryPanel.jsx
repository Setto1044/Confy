import Button from "../../../widgets/Button/Button";

const SummaryPanel = () => {
  return (
    <div className="relative p-2 h-92">
      <h2>요약정리</h2>
      
      {/* 버튼을 오른쪽 아래로 이동 */}
      <Button className="absolute bottom-4 right-4">수정하기</Button>
    </div>
  );
};

export default SummaryPanel;
