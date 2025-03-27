import React, { useState, useEffect } from "react";
import axios from "axios";

export default function WifiQR() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setQrCodeUrl(null);

    try {
      const response = await axios.post("/api/tools/wifi-qr", {
        SSID: ssid,
        Password: password
      }, {
        responseType: "blob"
      });

      const url = URL.createObjectURL(response.data);
      setQrCodeUrl(url);
    } catch (err) {
      setError(err.response?.data || "An error occurred while generating the QR code.");
    }
  };

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = `wifi-qr-${ssid}.png`; // Filename includes SSID
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Clean up the Blob URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (qrCodeUrl) {
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
        <form
          onSubmit={handleSubmit}
          className="mt-6 p-6 border border-gray-300 rounded-lg shadow-md bg-white"
        >
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
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter Wi-Fi password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-black text-white font-semibold rounded-md shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Generate QR Code
          </button>
        </form>

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
  );
}