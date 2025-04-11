import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Eye, EyeOff } from "lucide-react";

export default function WifiQR() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA"); // Default to WPA/WPA2
  const [hiddenSsid, setHiddenSsid] = useState(false);
  const [foregroundColor, setForegroundColor] = useState("#000000"); // Default black
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF"); // Default white
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Debounce function to delay QR code generation
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Escape special characters for WiFi payload
  const escapeSpecialCharacters = (input) => {
    return input.replace(/[\\;,:]/g, (match) => `\\${match}`);
  };

  // Generate WiFi QR code
  const generateQRCode = async () => {
    setError(null);
    setQrCodeUrl(null);

    if (!ssid.trim()) {
      setError("SSID is required.");
      return;
    }

    if (encryption !== "nopass" && !password.trim()) {
      setError("Password is required for this encryption type.");
      return;
    }

    // Validate colors
    const isValidHex = (hex) => /^#([0-9A-F]{3}){1,2}$/i.test(hex);
    if (!isValidHex(foregroundColor) || !isValidHex(backgroundColor)) {
      setError("Invalid color format. Use hex codes (e.g., #FFFFFF).");
      return;
    }

    try {
      // Create WiFi payload based on encryption type
      let wifiPayload;
      const escapedSsid = escapeSpecialCharacters(ssid);
      const escapedPassword = escapeSpecialCharacters(password);
      const hidden = hiddenSsid ? "true" : "false";

      switch (encryption) {
        case "nopass":
          wifiPayload = `WIFI:S:${escapedSsid};T:nopass;H:${hidden};;`;
          break;
        case "WPA":
          wifiPayload = `WIFI:S:${escapedSsid};T:WPA;P:${escapedPassword};H:${hidden};;`;
          break;
        case "WEP":
          wifiPayload = `WIFI:S:${escapedSsid};T:WEP;P:${escapedPassword};H:${hidden};;`;
          break;
        case "WPA2-EAP":
          // Note: WPA2-EAP requires additional fields in real-world scenarios (e.g., username, EAP method),
          // but for simplicity, we'll assume password-based WPA2-EAP here
          wifiPayload = `WIFI:S:${escapedSsid};T:WPA2-EAP;P:${escapedPassword};H:${hidden};;`;
          break;
        default:
          throw new Error("Invalid encryption type.");
      }

      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(wifiPayload, {
        errorCorrectionLevel: "Q", // Quartile, for reliability
        width: 256, // Size of QR code
        margin: 2, // Margin around QR code
        color: {
          dark: foregroundColor, // Foreground color
          light: backgroundColor, // Background color
        },
      });

      setQrCodeUrl(qrCodeDataUrl);
    } catch (err) {
      console.error("Error generating QR code:", err);
      setError("An error occurred while generating the QR code.");
    }
  };

  // Debounced QR code generation
  const debouncedGenerateQRCode = debounce(generateQRCode, 300);

  // Trigger QR code generation on input changes
  useEffect(() => {
    debouncedGenerateQRCode();
  }, [ssid, password, encryption, hiddenSsid, foregroundColor, backgroundColor]);

  // Handle download
  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = `wifi-qr-${ssid || "network"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Clean up QR code URL on unmount
  useEffect(() => {
    return () => {
      if (qrCodeUrl) {
        // Data URLs don't require revocation, but kept for consistency
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [qrCodeUrl]);

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen pt-8">
      <div className="w-full max-w-md p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">WiFi QR Code Generator</h2>
        <p className="text-sm text-center text-gray-600 mt-2">
          Generate and download QR codes for quick connections to WiFi networks.
        </p>
        <div className="mt-6 p-6 border border-gray-300 rounded-lg shadow-md bg-white">
          <div className="mb-4">
            <label htmlFor="ssid" className="block text-gray-700 font-medium mb-2">
              SSID:
            </label>
            <input
              type="text"
              id="ssid"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              required
              placeholder="Enter Wi-Fi SSID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="encryption" className="block text-gray-700 font-medium mb-2">
              Encryption:
            </label>
            <select
              id="encryption"
              value={encryption}
              onChange={(e) => setEncryption(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="nopass">No Password</option>
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="WPA2-EAP">WPA2-EAP</option>
            </select>
          </div>

          {encryption !== "nopass" && (
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter Wi-Fi password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={hiddenSsid}
                onChange={(e) => setHiddenSsid(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-gray-700 font-medium">Hidden SSID</span>
            </label>
          </div>

          <div className="mb-4">
            <label htmlFor="foregroundColor" className="block text-gray-700 font-medium mb-2">
              Foreground Color:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="foregroundColor"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                className="w-12 h-12 p-0 border-none cursor-pointer"
              />
              <input
                type="text"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                placeholder="#000000"
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="backgroundColor" className="block text-gray-700 font-medium mb-2">
              Background Color:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="backgroundColor"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-12 h-12 p-0 border-none cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                placeholder="#FFFFFF"
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && <p className="mt-4 text-center text-red-600">{error}</p>}
          {qrCodeUrl && (
            <div className="mt-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Your Wi-Fi QR Code for {ssid}:
              </h3>
              <img
                src={qrCodeUrl}
                alt="Wi-Fi QR Code"
                className="mt-4 mx-auto max-w-full h-auto"
              />
              <button
                onClick={handleDownload}
                className="mt-4 px-4 py-2 bg-black text-white font-semibold rounded-md shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Download QR Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}