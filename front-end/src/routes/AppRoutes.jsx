import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/MainContent";
import HashText from "../pages/Crypto/HashText";
import WifiQR from "../pages/WifiQR"; 
import TokenGenerator from "../pages/Crypto/TokenGenerator";
import Bcrypt from "../pages/Crypto/Bcrypt"; 
import BaseConverter from "../pages/BaseConverter";
import AddTool  from "../pages/AddTool";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Use MainLayout for all routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/hash-text" element={<HashText />} />
        <Route path="/bcrypt" element={<Bcrypt />} /> {/* Add this route */}
        <Route path="/wifi-qr" element={<WifiQR />} /> {/* Add this route */}
        <Route path="/token-generator" element={<TokenGenerator />} /> {/* Add this route */}
        <Route path="/base-converter" element={<BaseConverter />} /> {/* Add this route */}
        <Route path="/add-tool" element={<AddTool />} />
      </Route>
    </Routes>
  );
}