import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { ToolsContext } from '../context/ToolsContext';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/MainContent';
import HashText from '../pages/Crypto/HashText';
import WifiQR from '../pages/Images And Videos/WifiQR';
import CameraRecorder from '../pages/Images And Videos/CameraRecorder';
import TokenGenerator from '../pages/Crypto/TokenGenerator';
import Bcrypt from '../pages/Crypto/Bcrypt';
import BaseConverter from '../pages/Converter/BaseConverter';
import RomanNumeralConverter from '../pages/Converter/RomanNumeralConverter';
import ColorConverter from '../pages/Converter/ColorConverter';
import QRCodeGenerator from '../pages/Images And Videos/QRCodeGenerator';
import URLParser from '../pages/Web/URLparser';
import IPv4SubnetCalculator from '../pages/Network/IPv4SubnetCal';
import JWTParser from '../pages/Web/JWTparser';
import BasicAuthGenerator from '../pages/Web/BasicAuthGenerator';
import JSONMinify from '../pages/Development/JSONminify';
import RandomPortGenerator from '../pages/Development/RandomPortGenerator';
import GitCheatSheet from '../pages/Development/GitCheatSheet';
import MathEvaluator from '../pages/Math/MathEvaluator';
import ETACalculator from '../pages/Math/ETACaculator';
import Login from '../components/Login';
import Signup from '../components/Signup';
import AdminRoute from './AdminRoutes';
import PercentageCalculator from '../pages/Math/PercentageCalculator';
import TextStatistics from '../pages/Text/TextStatistics';
import AddTool from '../pages/Admin/AddTool';
import NumeronymGenerator from '../pages/Text/NumeronymGenerator';
import StringObfuscator from '../pages/Text/StringObfuscator';
import MacAddressLookup from '../pages/Network/MacAddressLookup';
import IPv4AddressConverter from '../pages/Network/IPv4AddressConverter';
import TemperatureConverter from '../pages/Measurement/TemperatureConverter';
import Chronometer from '../pages/Measurement/Chronometer';
import BenchmarkBuilder from '../pages/Measurement/BenchmarkBuilder';
import PhoneParserAndFormatter from '../pages/Data/PhoneParserAndFormatter';
import IbanValidatorAndParser from '../pages/Data/IBANValidatorAndParser';
import UserManagement from '../pages/Admin/UserManagement';
import ToolManagement from '../pages/Admin/ToolManagement';
import UpgradeRequest from '../pages/Admin/UpgradeRequest';

// Mapping of tool paths to their corresponding components (without leading slashes)
const toolComponents = {
  'hash-text': HashText,
  'wifi-qr': WifiQR,
  'camera-recorder': CameraRecorder,
  'token-generator': TokenGenerator,
  'bcrypt': Bcrypt,
  'base-converter': BaseConverter,
  'roman-numeral-converter': RomanNumeralConverter,
  'color-converter': ColorConverter,
  'qr-code-generator': QRCodeGenerator,
  'url-parser': URLParser,
  'ipv4-subnet-calculator': IPv4SubnetCalculator,
  'jwt-parser': JWTParser,
  'basic-auth-generator': BasicAuthGenerator,
  'json-minify': JSONMinify,
  'random-port-generator': RandomPortGenerator,
  'git-cheat-sheet': GitCheatSheet,
  'math-evaluator': MathEvaluator,
  'eta-calculator': ETACalculator,
  'percentage-calculator': PercentageCalculator,
  'text-statistics': TextStatistics,
  'numeronym-generator': NumeronymGenerator,
  'string-obfuscator': StringObfuscator,
  'mac-address-lookup': MacAddressLookup,
  'ipv4-address-converter': IPv4AddressConverter,
  'temperature-converter': TemperatureConverter,
  'chronometer': Chronometer,
  'benchmark-builder': BenchmarkBuilder,
  'phone-parser-and-formatter': PhoneParserAndFormatter,
  'iban-validator-and-parser': IbanValidatorAndParser,
};

export default function AppRoutes() {
  const { tools, isLoading } = useContext(ToolsContext); // Access tools and loading state from ToolsContext

  // Flatten tools from categories into a single array
  const flattenedTools = tools.flatMap(category => category.items);

  return (
    <Routes>
      {/* Static routes for login and signup */}
      <Route element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Main routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        {/* Dynamically generate routes for enabled tools */}
        {!isLoading &&
          flattenedTools.map(tool => {
            const Component = toolComponents[tool.path];
            if (!Component) {
              console.warn(`No component found for tool path: ${tool.path}`);
              return null;
            }
            return (
              <Route
                key={tool.id}
                path={tool.path} // Use path as-is from database (e.g., "git-cheat-sheet")
                element={<Component />}
              />
            );
          })}

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Routes>
                <Route path="/" element={<UserManagement />} />
                <Route path="/add-tool" element={<AddTool />} />
                <Route path="/tool-management" element={<ToolManagement />} />
                <Route path="/upgrade-request" element={<UpgradeRequest />} />
              </Routes>
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}