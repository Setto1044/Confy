import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "../pages/ConferencePage/MainPage";
import MeetingPage from "../pages/ConferencePage/MeetingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/meeting" element={<MeetingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
