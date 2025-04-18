import React, { useState, useEffect } from "react";

export default function RomanNumeralConverter() {
  const [arabicInput, setArabicInput] = useState("");
  const [romanInput, setRomanInput] = useState("");
  const [arabicResult, setArabicResult] = useState("");
  const [romanResult, setRomanResult] = useState("");
  const [arabicError, setArabicError] = useState("");
  const [romanError, setRomanError] = useState("");

  // Roman numeral mappings
  const RomanValues = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  const DecimalToRoman = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Check if input is a valid Roman numeral
  const isRomanNumeral = (input) => {
    const upperInput = input.toUpperCase();
    return upperInput.split("").every((char) => Object.keys(RomanValues).includes(char));
  };

  // Convert Roman numeral to decimal
  const romanToDecimal = (roman) => {
    const upperRoman = roman.toUpperCase();
    let result = 0;
    let prevValue = 0;

    for (let i = upperRoman.length - 1; i >= 0; i--) {
      const currentValue = RomanValues[upperRoman[i]];
      if (currentValue >= prevValue) {
        result += currentValue;
      } else {
        result -= currentValue;
      }
      prevValue = currentValue;
    }

    // Validate the result
    if (result < 1 || result > 3999 || decimalToRoman(result) !== upperRoman) {
      throw new Error("Invalid Roman numeral sequence");
    }

    return result;
  };

  // Convert decimal to Roman numeral
  const decimalToRoman = (number) => {
    if (number < 1 || number > 3999) {
      throw new Error("Number must be between 1 and 3999");
    }

    let roman = "";
    for (const [value, symbol] of DecimalToRoman) {
      while (number >= value) {
        roman += symbol;
        number -= value;
      }
    }
    return roman;
  };

  // Main conversion function
  const convertNumber = (input, type) => {
    if (type === "arabic") {
      setArabicError("");
      setArabicResult("");
    } else {
      setRomanError("");
      setRomanResult("");
    }

    if (!input.trim()) return;

    try {
      if (type === "arabic") {
        // Try converting from decimal to Roman
        const number = parseInt(input.trim());
        if (isNaN(number)) {
          throw new Error("Input must be a valid number");
        }
        const romanValue = decimalToRoman(number);
        setArabicResult(romanValue);
      } else {
        // Try converting from Roman to decimal
        if (!isRomanNumeral(input)) {
          throw new Error("Input contains invalid Roman numeral characters");
        }
        const decimalValue = romanToDecimal(input);
        setRomanResult(decimalValue.toString());
      }
    } catch (err) {
      const errorMsg = err.message || "Invalid input";
      if (type === "arabic") {
        setArabicError(errorMsg);
      } else {
        setRomanError(errorMsg);
      }
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
    if (text) {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
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
              arabicResult
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
              romanResult
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}