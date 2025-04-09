// IntegerBaseConverter.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function IntegerBaseConverter() {
  const [number, setNumber] = useState("");
  const [inputBase, setInputBase] = useState("10");
  const [customOutputBase, setCustomOutputBase] = useState(""); // New state for custom output base
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const convertNumber = async (num, inBase, outBase) => {
    setError(null);
    setResult(null);

    if (!num.trim() || !inBase) {
      return;
    }

    const parsedInputBase = parseInt(inBase);
    if (isNaN(parsedInputBase) || parsedInputBase < 2 || parsedInputBase > 64) {
      setError("Input base must be a number between 2 and 64");
      return;
    }

    // Optional custom output base validation
    let parsedOutputBase = outBase ? parseInt(outBase) : null;
    if (outBase && (isNaN(parsedOutputBase) || parsedOutputBase < 2 || parsedOutputBase > 64)) {
      setError("Custom output base must be a number between 2 and 64");
      return;
    }

    try {
      const response = await axios.post("/api/tools/base-converter", {
        Number: num.trim(),
        Base: parsedInputBase,
        CustomBase: parsedOutputBase // Send custom output base if provided
      });
      setResult(response.data);
    } catch (err) {
        console.log(err);
      setError(err.response?.data?.message || "Invalid number for the selected base");
    }
  };

  const debouncedConvert = debounce(convertNumber, 300);

  useEffect(() => {
    debouncedConvert(number, inputBase, customOutputBase);
  }, [number, inputBase, customOutputBase]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Integer Base Converter</h1>
      <p className="text-gray-600 mb-4">
        Convert integers from any base (2-64) to binary, octal, decimal, 
        hexadecimal, Base64, and a custom output base.
      </p>

      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="font-medium">Input Integer:</label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter your number"
              className="p-2 border rounded w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Input Base (2-64):</label>
            <input
              type="number"
              value={inputBase}
              onChange={(e) => setInputBase(e.target.value)}
              min="2"
              max="64"
              placeholder="Enter input base"
              className="p-2 border rounded w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-medium">Custom Output Base (2-64):</label>
              <input
                type="number"
                value={customOutputBase}
                onChange={(e) => setCustomOutputBase(e.target.value)}
                min="2"
                max="64"
                placeholder="Optional output base"
                className="p-2 border rounded w-full"
              />
            </div>
            {result?.CustomBase && (
              <div className="flex-1">
                <p className="text-gray-700">
                  Base {result.CustomBaseNumber}: {result.CustomBase}
                </p>
              </div>
            )}
          </div>

          {result && (
            <>
              <hr className="my-4 border-t border-gray-300" />
              <div className="space-y-2">
                <h2 className="font-semibold">Results:</h2>
                <p>Binary: {result.Binary}</p>
                <p>Octal: {result.Octal}</p>
                <p>Decimal: {result.Decimal}</p>
                <p>Hexadecimal: {result.Hexadecimal}</p>
                <p>Base64: {result.Base64}</p>
              </div>
            </>
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}