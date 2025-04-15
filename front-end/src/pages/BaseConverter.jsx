import React, { useState, useEffect } from "react";

export default function IntegerBaseConverter() {
  const [number, setNumber] = useState("");
  const [inputBase, setInputBase] = useState("10");
  const [customOutputBase, setCustomOutputBase] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";

  // Debounce function to delay execution
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Parse number from custom base to decimal
  const parseFromCustomBase = (number, fromBase) => {
    let num = number.trim().toUpperCase();
    const isNegative = num.startsWith("-");
    if (isNegative) num = num.substring(1);

    let result = 0;
    for (let i = 0; i < num.length; i++) {
      const digitValue = DIGITS.indexOf(num[i]);
      if (digitValue < 0 || digitValue >= fromBase) {
        throw new Error(`Invalid digit '${num[i]}' for base ${fromBase}`);
      }
      result = result * fromBase + digitValue;
    }

    return isNegative ? -result : result;
  };

  // Convert decimal to custom base
  const convertToCustomBase = (value, baseValue) => {
    if (baseValue < 2 || baseValue > 64) {
      throw new Error("Base must be between 2 and 64");
    }

    if (value === 0) return "0";

    const isNegative = value < 0;
    value = Math.abs(value);
    let result = "";

    while (value > 0) {
      const remainder = value % baseValue;
      result = DIGITS[remainder] + result;
      value = Math.floor(value / baseValue);
    }

    return isNegative ? "-" + result : result;
  };

  // Main conversion logic
  const convertNumber = (num, inBase, outBase) => {
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

    let parsedOutputBase = outBase ? parseInt(outBase) : null;
    if (outBase && (isNaN(parsedOutputBase) || parsedOutputBase < 2 || parsedOutputBase > 64)) {
      setError("Custom output base must be a number between 2 and 64");
      return;
    }

    try {
      // Parse input to decimal
      const decimalValue = parseFromCustomBase(num.trim(), parsedInputBase);

      // Prepare results
      const result = {
        Binary: decimalValue.toString(2),
        Octal: decimalValue.toString(8),
        Decimal: decimalValue.toString(),
        Hexadecimal: decimalValue.toString(16).toLowerCase(),
        Base64: convertToCustomBase(decimalValue, 64),
      };

      // Handle custom base if provided
      if (parsedOutputBase) {
        result.CustomBase = convertToCustomBase(decimalValue, parsedOutputBase);
        result.CustomBaseNumber = parsedOutputBase.toString();
      }

      setResult(result);
    } catch (err) {
      setError(err.message || "Invalid number for the selected base");
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