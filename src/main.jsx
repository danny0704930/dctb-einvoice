import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import RequestForm from "./pages/RequestForm.jsx";
import AdminList from "./pages/AdminList.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/e/request" element={<RequestForm />} />
        <Route path="/admin" element={<AdminList />} />
        <Route path="*" element={<Navigate to="/e/request" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

