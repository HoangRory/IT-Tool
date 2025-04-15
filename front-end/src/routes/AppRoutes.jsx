import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/MainContent";
import HashText from "../pages/Crypto/HashText";
import WifiQR from "../pages/WifiQR"; 
import TokenGenerator from "../pages/Crypto/TokenGenerator";
import Bcrypt from "../pages/Crypto/Bcrypt"; 
import BaseConverter from "../pages/BaseConverter";
import RomanNumeralConverter from "../pages/RomanNumeralConverter";
import ColorConverter from "../pages/ColorConverter";
import QRCodeGenerator from "../pages/QRCodeGenerator";
import URLParser from "../pages/Web/URLparser";
import IPv4SubnetCalculator from "../pages/IPv4SubnetCal";
import BasicAuthGenerator from "../pages/Web/BasicAuthGenerator";
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
        <Route path="roman-numeral-converter" element={<RomanNumeralConverter />} /> {/* Add this route */}
        <Route path="color-converter" element={<ColorConverter />} /> {/* Add this route */}
        <Route path="qr-code-generator" element={<QRCodeGenerator />} /> {/* Add this route */}
        <Route path="/url-parser" element={<URLParser />} /> {/* Add this route */}
        <Route path="/basic-auth-generator" element={<BasicAuthGenerator />} /> {/* Add this route */}
        <Route path="ipv4-subnet-calculator" element={<IPv4SubnetCalculator />} /> {/* Add this route */}
        <Route path="/add-tool" element={<AddTool />} />
      </Route>
    </Routes>
  );
}