import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BankApp }  from "./BankApp";
import { AdminApp } from "./AdminApp";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Bank-facing portal — main URL (/) ── */}
        <Route path="/*"     element={<BankApp />} />

        {/* ── Admin portal — /admin ── */}
        <Route path="/admin"  element={<AdminApp />} />
        <Route path="/admin/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
