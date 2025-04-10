import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/MainContent";
import HashText from "../pages/HashText";
import WifiQR from "../pages/WifiQR"; 
import TokenGenerator from "../pages/TokenGenerator";
import BaseConverter from "../pages/BaseConverter";
import RomanNumeralConverter from "../pages/RomanNumeralConverter";
import ColorConverter from "../pages/ColorConverter";
import QRCodeGenerator from "../pages/QRCodeGenerator";
import AddTool  from "../pages/AddTool";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Use MainLayout for all routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/hash-text" element={<HashText />} />
        <Route path="/wifi-qr" element={<WifiQR />} /> {/* Add this route */}
        <Route path="/token-generator" element={<TokenGenerator />} /> {/* Add this route */}
        <Route path="/base-converter" element={<BaseConverter />} /> {/* Add this route */}
        <Route path="roman-numeral-converter" element={<RomanNumeralConverter />} /> {/* Add this route */}
        <Route path="color-converter" element={<ColorConverter />} /> {/* Add this route */}
        <Route path="qr-code-generator" element={<QRCodeGenerator />} /> {/* Add this route */}
        <Route path="/add-tool" element={<AddTool />} />
      </Route>
    </Routes>
  );
}