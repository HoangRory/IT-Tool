import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/MainContent';
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
import JWTParser from "../pages/Web/JWTparser";
import BasicAuthGenerator from "../pages/Web/BasicAuthGenerator";
import JSONMinify from "../pages/Development/JSONminify";
import RandomPortGenerator from "../pages/Development/RandomPortGenerator";
import GitCheatSheet from "../pages/Development/GitCheatSheet";
import MathEvaluator from "../pages/Math/MathEvaluator";
import ETACalculator from "../pages/Math/ETACaculator";
import AddTool from '../pages/AddTool';
import Login from '../components/Login';
import Signup from '../components/Signup';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        element={
            <MainLayout />
        }
      >
        <Route path="/" element={<Home />} />

        {/* tool crypto */}
        <Route path="/hash-text" element={<HashText />} />
        <Route path="/bcrypt" element={<Bcrypt />} /> {/* Add this route */}
        <Route path="/token-generator" element={<TokenGenerator />} /> {/* Add this route */}
      
        {/* tool converter */}
        <Route path="/base-converter" element={<BaseConverter />} /> {/* Add this route */}
        <Route path="roman-numeral-converter" element={<RomanNumeralConverter />} /> {/* Add this route */}
        <Route path="color-converter" element={<ColorConverter />} /> {/* Add this route */}
        

        {/* tool network */}
        <Route path="ipv4-subnet-calculator" element={<IPv4SubnetCalculator />} /> {/* Add this route */}

        {/* tool image & video */}
        <Route path="/wifi-qr" element={<WifiQR />} /> {/* Add this route */}
        <Route path="qr-code-generator" element={<QRCodeGenerator />} /> {/* Add this route */}

        {/* tool web */}
        <Route path="/basic-auth-generator" element={<BasicAuthGenerator />} /> {/* Add this route */}
        <Route path="/jwt-parser" element={<JWTParser />} /> {/* Add this route */}
        <Route path="/url-parser" element={<URLParser />} /> {/* Add this route */}

        {/* tool development */}
        <Route path="/json-minify" element={<JSONMinify />} /> {/* Add this route */}
        <Route path="/random-port-generator" element={<RandomPortGenerator />} /> {/* Add this route */}
        <Route path="/git-cheat-sheet" element={<GitCheatSheet />} /> {/* Add this route */}

        {/* tool math */}
        <Route path="/math-evaluator" element={<MathEvaluator />} /> {/* Add this route */}
        <Route path="/eta-calculator" element={<ETACalculator />} /> {/* Add this route */}
        {/* tool text */}
      </Route>
    </Routes>
  );
}