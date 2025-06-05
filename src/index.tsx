import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnalysisPage } from "./pages/AnalysisPage";
import { Body } from "./screens/Body/Body";
import { SubscriptionPlansPage } from "./pages/SubscriptionPlansPage";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/subscriptions" element={<SubscriptionPlansPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
