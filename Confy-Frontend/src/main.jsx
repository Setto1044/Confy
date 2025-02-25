import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./shared/store/store";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* Redux Provider */}
      <QueryClientProvider client={queryClient}>
        {/* 스크립트 데이터 캐싱 */}
        <App />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
