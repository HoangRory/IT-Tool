// RomanNumeralConverter.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RomanNumeralConverter() {
  const [arabicInput, setArabicInput] = useState("");
  const [romanInput, setRomanInput] = useState("");
  const [arabicResult, setArabicResult] = useState("");
  const [romanResult, setRomanResult] = useState("");
  const [arabicError, setArabicError] = useState("");
  const [romanError, setRomanError] = useState("");

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const convertNumber = async (input, type) => {
    if (type === "arabic") {
      setArabicError("");
      setArabicResult("");
    } else {
      setRomanError("");
      setRomanResult("");
    }

    if (!input.trim()) return;

    try {
      const response = await axios.post("/api/tools/roman-numeral-converter", {
        Input: input.trim(),
      });

      if (type === "arabic" && response.data.InputType === "Decimal") {
        setArabicResult(response.data.Roman);
      } else if (type === "roman" && response.data.InputType === "Roman") {
        setRomanResult(response.data.Decimal);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid input";
      if (type === "arabic") setArabicError(errorMsg);
      else setRomanError(errorMsg);
    }
  };

  const debouncedConvertArabic = debounce((input) => convertNumber(input, "arabic"), 300);
  const debouncedConvertRoman = debounce((input) => convertNumber(input, "roman"), 300);

  useEffect(() => {
    debouncedConvertArabic(arabicInput);
  }, [arabicInput]);

  useEffect(() => {
    debouncedConvertRoman(romanInput);
  }, [romanInput]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Roman Numeral Converter</h1>
      <p className="text-gray-600 mb-6">
        Convert between Arabic numbers (1-3999) and Roman numerals.
      </p>

      {/* Arabic to Roman Box */}
      <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Arabic to Roman</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={arabicInput}
              onChange={(e) => setArabicInput(e.target.value)}
              placeholder="Enter number (1-3999)"
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="flex-1 text-center">
            {arabicResult && <p className="text-gray-700">{arabicResult}</p>}
            {arabicError && <p className="text-red-500">{arabicError}</p>}
          </div>
          <button
            onClick={() => copyToClipboard(arabicResult)}
            disabled={!arabicResult}
            className={`p-2 rounded ${
              arabicResult ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Copy
          </button>
        </div>
      </div>

      {/* Roman to Arabic Box */}
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Roman to Arabic</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={romanInput}
              onChange={(e) => setRomanInput(e.target.value)}
              placeholder="Enter Roman numeral (e.g., XII)"
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="flex-1 text-center">
            {romanResult && <p className="text-gray-700">{romanResult}</p>}
            {romanError && <p className="text-red-500">{romanError}</p>}
          </div>
          <button
            onClick={() => copyToClipboard(romanResult)}
            disabled={!romanResult}
            className={`p-2 rounded ${
              romanResult ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}