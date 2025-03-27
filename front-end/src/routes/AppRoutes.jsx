import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/MainContent";
// import TokenGenerator from "../pages/TokenGenerator";
import HashText from "../pages/HashText";

export default function AppRoutes() {
  return (
      <Routes>
        {/* Dùng Layout chung */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/token-generator" element={<TokenGenerator />} /> */}
          <Route path="/hash-text" element={<HashText />} />
        </Route>
      </Routes>
  );
}
