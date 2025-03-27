import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/MainContent";
// import TokenGenerator from "../pages/TokenGenerator";
import HashText from "../pages/HashText";
import WifiQR from "../pages/WifiQR"; // Import the new component
import TokenGenerator from "../pages/TokenGenerator";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Use MainLayout for all routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        {/* <Route path="/token-generator" element={<TokenGenerator />} /> */}
        <Route path="/hash-text" element={<HashText />} />
        <Route path="/wifi-qr" element={<WifiQR />} /> {/* Add this route */}
        <Route path="/token-generator" element={<TokenGenerator />} /> {/* Add this route */}
      </Route>
    </Routes>
  );
}