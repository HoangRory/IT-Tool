import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/MainContent';
import HashText from "../pages/Crypto/HashText";
import WifiQR from "../pages/Images And Videos/WifiQR";
import CameraRecorder from "../pages/Images And Videos/CameraRecorder";
import TokenGenerator from "../pages/Crypto/TokenGenerator";
import Bcrypt from "../pages/Crypto/Bcrypt"; 
import BaseConverter from "../pages/Converter/BaseConverter";
import RomanNumeralConverter from "../pages/Converter/RomanNumeralConverter";
import ColorConverter from "../pages/Converter/ColorConverter";
import QRCodeGenerator from "../pages/Images And Videos/QRCodeGenerator";
import URLParser from "../pages/Web/URLparser";
import IPv4SubnetCalculator from "../pages/Network/IPv4SubnetCal";
import JWTParser from "../pages/Web/JWTparser";
import BasicAuthGenerator from "../pages/Web/BasicAuthGenerator";
import JSONMinify from "../pages/Development/JSONminify";
import RandomPortGenerator from "../pages/Development/RandomPortGenerator";
import GitCheatSheet from "../pages/Development/GitCheatSheet";
import MathEvaluator from "../pages/Math/MathEvaluator";
import ETACalculator from "../pages/Math/ETACaculator";
import Login from '../components/Login';
import Signup from '../components/Signup';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoutes';
import PercentageCalculator from "../pages/Math/PercentageCalculator";
import TextStatistics from "../pages/Text/TextStatistics";
import AddTool  from "../pages/Admin/AddTool";
import NumeronymGenerator from "../pages/Text/NumeronymGenerator";
import StringObfuscator from "../pages/Text/StringObfuscator";
import MacAddressLookup from "../pages/Network/MacAddressLookup";
import IPv4AddressConverter from '../pages/Network/IPv4AddressConverter';
import TemperatureConverter from '../pages/Measurement/TemperatureConverter';
import Chronometer from '../pages/Measurement/Chronometer';
import BenchmarkBuilder from '../pages/Measurement/BenchmarkBuilder';
import PhoneParserAndFormatter from '../pages/Data/PhoneParserAndFormatter';
import IbanValidatorAndParser from '../pages/Data/IBANValidatorAndParser';
import UserManagement from "../pages/Admin/UserManagement";
import ToolManagement from '../pages/Admin/ToolManagement';

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
        <Route path="mac-address-lookup" element={<MacAddressLookup />} /> {/* Add this route */}
        <Route path="ipv4-address-converter" element={<IPv4AddressConverter />} /> {/* Add this route */}

        {/* tool image & video */}
        <Route path="/wifi-qr" element={<WifiQR />} /> {/* Add this route */}
        <Route path="qr-code-generator" element={<QRCodeGenerator />} /> {/* Add this route */}
        <Route path="camera-recorder" element={<CameraRecorder />} /> {/* Add this route */}

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
        <Route path="/percentage-calculator" element={<PercentageCalculator />} /> {/* Add this route */}

        {/* tool text */}
        <Route path="/text-statistics" element={<TextStatistics />} /> {/* Add this route */}
        <Route path="/numeronym-generator" element={<NumeronymGenerator />} /> {/* Add this route */}
        <Route path="/string-obfuscator" element={<StringObfuscator />} /> {/* Add this route */}

        {/* tool measurement */}
        <Route path="/temperature-converter" element={<TemperatureConverter />} /> {/* Add this route */}
        <Route path="/chronometer" element={<Chronometer />} /> {/* Add this route */}
        <Route path="/benchmark-builder" element={<BenchmarkBuilder />} /> {/* Add this route */}

        {/* tool data */}
        <Route path="/phone-parser-and-formatter" element={<PhoneParserAndFormatter />} /> {/* Add this route */}
        <Route path="/iban-validator-and-parser" element={<IbanValidatorAndParser />} /> {/* Add this route */}

        {/* Protect all /admin/* routes */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Routes>
                <Route index element={<UserManagement />} />
                {/* Add more admin routes here, e.g., <Route path="settings" element={<AdminSettings />} /> */}
                <Route path="/add-tool" element={<AddTool />} />
                <Route path="/tool-management" element={<ToolManagement />} />
              </Routes>
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}