export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "00:00"; // 예외 처리

  const date = new Date(timestamp);
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  
  return `${minutes}:${seconds}`;
};
