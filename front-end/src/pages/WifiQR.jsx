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

  // Clean up the Blob URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [qrCodeUrl]);

  return (
    <div className="wifi-qr-page">
      <h2>Wi-Fi QR Code Generator</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ssid">SSID:</label>
          <input
            type="text"
            id="ssid"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
            required
            placeholder="Enter Wi-Fi SSID"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter Wi-Fi password"
          />
        </div>
        <button type="submit">Generate QR Code</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {qrCodeUrl && (
        <div>
          <h3>Your Wi-Fi QR Code for {ssid}:</h3>
          <img src={qrCodeUrl} alt="Wi-Fi QR Code" />
        </div>
      )}
    </div>
  );
}