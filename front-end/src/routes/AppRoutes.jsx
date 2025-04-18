import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/MainContent';
import HashText from '../pages/Crypto/HashText';
import WifiQR from '../pages/WifiQR';
import TokenGenerator from '../pages/Crypto/TokenGenerator';
import Bcrypt from '../pages/Crypto/Bcrypt';
import BaseConverter from '../pages/BaseConverter';
import RomanNumeralConverter from '../pages/RomanNumeralConverter';
import ColorConverter from '../pages/ColorConverter';
import QRCodeGenerator from '../pages/QRCodeGenerator';
import URLParser from '../pages/Web/URLparser';
import IPv4SubnetCalculator from '../pages/IPv4SubnetCal';
import BasicAuthGenerator from '../pages/Web/BasicAuthGenerator';
import AddTool from '../pages/AddTool';
import Login from '../components/Login';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />

        {/* tool crypto */}
        <Route path="/hash-text" element={<HashText />} />
        <Route path="/bcrypt" element={<Bcrypt />} />
        <Route path="/wifi-qr" element={<WifiQR />} />
        <Route path="/token-generator" element={<TokenGenerator />} />
        <Route path="/base-converter" element={<BaseConverter />} />
        <Route path="/roman-numeral-converter" element={<RomanNumeralConverter />} />
        <Route path="/color-converter" element={<ColorConverter />} />
        <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
        <Route path="/url-parser" element={<URLParser />} />
        <Route path="/basic-auth-generator" element={<BasicAuthGenerator />} />
        <Route path="/ipv4-subnet-calculator" element={<IPv4SubnetCalculator />} />
        <Route path="/add-tool" element={<AddTool />} />
      </Route>
    </Routes>
  );
}