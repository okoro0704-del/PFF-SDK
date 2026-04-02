import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BankApp }  from "./BankApp";
import { AdminApp } from "./AdminApp";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Admin portal — listed FIRST so the wildcard below never shadows it ── */}
        <Route path="/admin"  element={<AdminApp />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

        {/* ── Bank / Agent portal — catches everything else ── */}
        <Route path="/*" element={<BankApp />} />
      </Routes>
    </BrowserRouter>
  );
}
