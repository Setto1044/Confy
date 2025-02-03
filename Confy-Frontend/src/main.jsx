import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./index.css";

// 스크립트 데이터 캐싱을 위한 QueryClient 생성
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
