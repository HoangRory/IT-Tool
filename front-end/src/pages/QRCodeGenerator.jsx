import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QRCodeGenerator = () => {
  // State for form inputs and QR code result
  const [text, setText] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [errorResistance, setErrorResistance] = useState('medium');
  const [qrCodeUrl, setQrCodeUrl] = useState(''); // Store Blob URL
  const [error, setError] = useState(null); // Store error messages

  // Function to generate QR code by calling the API with Axios
  const generateQRCode = async () => {
    if (!text) {
      setQrCodeUrl('');
      setError(null);
      return;
    }

    try {
      const response = await axios.post(
        '/api/tools/qr-code-generator',
        {
          Text: text,
          BackgroundColor: backgroundColor,
          ForegroundColor: foregroundColor,
          ErrorResistance: errorResistance,
        },
        {
          responseType: 'blob', // Expect a Blob response
        }
      );

      // Create a URL from the Blob response
      const url = URL.createObjectURL(response.data);
      setQrCodeUrl(url);
      setError(null);
    } catch (err) {
      console.error('Error generating QR code:', err);
      setQrCodeUrl('');
      setError(
        err.response?.data || 'An error occurred while generating the QR code.'
      );
    }
  };

  // Trigger QR code generation whenever inputs change
  useEffect(() => {
    generateQRCode();
  }, [text, backgroundColor, foregroundColor, errorResistance]);

  // Clean up Blob URL when component unmounts or qrCodeUrl changes
  useEffect(() => {
    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl); // Prevent memory leaks
      }
    };
  }, [qrCodeUrl]);

  // Handle download button click
  const handleDownload = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        QR Code Generator
      </h1>

      {/* Description */}
      <p className="text-gray-600 mb-6">
        Generate and download a QR code for a URL or text with customizable
        colors and error correction.
      </p>

      {/* Tool Content Box */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Input Fields */}
          <div className="space-y-6">
            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text or URL
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text or URL"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-12 p-0 border-none cursor-pointer"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Foreground Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foreground Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="w-12 h-12 p-0 border-none cursor-pointer"
                />
                <input
                  type="text"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="w-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Error Resistance Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Error Resistance
              </label>
              <select
                value={errorResistance}
                onChange={(e) => setErrorResistance(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="quartile">Quartile</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Right Column: QR Code Output */}
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              QR Code Preview
            </h2>
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="Generated QR Code"
                className="w-64 h-64 mb-4"
              />
            ) : (
              <div className="w-64 h-64 bg-gray-100 flex items-center justify-center text-gray-500 mb-4">
                Enter text to generate QR code
              </div>
            )}
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <button
              onClick={handleDownload}
              disabled={!qrCodeUrl}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                qrCodeUrl
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Download QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;