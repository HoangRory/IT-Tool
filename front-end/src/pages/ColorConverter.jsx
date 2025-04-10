import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ColorConverter() {
  const [hex, setHex] = useState("#ff0000ff");
  const [rgb, setRgb] = useState("rgb(255, 0, 0)");
  const [hsl, setHsl] = useState("hsl(0, 100%, 50%)");
  const [hwb, setHwb] = useState("hwb(0 0% 0%)");
  const [lch, setLch] = useState("lch(50% 50 0)");
  const [cmyk, setCmyk] = useState("cmyk(0%, 100%, 100%, 0%)");
  const [css, setCss] = useState("red");
  const [alpha, setAlpha] = useState("1.00");
  const [error, setError] = useState("");
  const [activeField, setActiveField] = useState(null); // Track the currently focused field

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const convertColor = async (input, format) => {
    setError("");
    if (!input.trim()) return;

    try {
      const response = await axios.post("/api/tools/color-converter", {
        Color: input.trim(),
        Format: format,
      });
      updateFields(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid color format");
    }
  };

  const updateFields = (data) => {
    const normalize = (str) => str.replace(/\s+/g, " ").toLowerCase();
    
    // Only update fields that are not currently active
    if (activeField !== "hex" && normalize(data.hex) !== normalize(hex)) setHex(data.hex);
    if (activeField !== "rgb" && normalize(data.rgb) !== normalize(rgb)) setRgb(data.rgb);
    if (activeField !== "hsl" && normalize(data.hsl) !== normalize(hsl)) setHsl(data.hsl);
    if (activeField !== "hwb" && normalize(data.hwb) !== normalize(hwb)) setHwb(data.hwb);
    if (activeField !== "lch" && normalize(data.lch) !== normalize(lch)) setLch(data.lch);
    if (activeField !== "cmyk" && normalize(data.cmyk) !== normalize(cmyk)) setCmyk(data.cmyk);
    if (activeField !== "css" && normalize(data.css === "none" ? "" : data.css) !== normalize(css)) {
      setCss(data.css === "none" ? "" : data.css);
    }

    // Update alpha unless hex is active (since alpha is derived from hex)
    if (activeField !== "hex" && activeField !== "alpha") {
      const newAlpha = parseFloat(parseInt(data.hex.slice(-2), 16) / 255).toFixed(2);
      if (newAlpha !== alpha) setAlpha(newAlpha);
    }
  };

  const debouncedConvert = debounce(convertColor, 300);

  const handleInputChange = (value, format, setter) => {
    setter(value);
    debouncedConvert(value, format);
  };

  const handleFocus = (format) => {
    setActiveField(format);
  };

  const handleBlur = (value, format) => {
    setActiveField(null); // Clear active field on blur
    debouncedConvert(value, format); // Trigger conversion when leaving the field
  };

  const handleColorPickerChange = (e) => {
    const newHex = `${e.target.value}${parseFloat(alpha) < 1 ? Math.round(parseFloat(alpha) * 255).toString(16).padStart(2, "0") : "ff"}`;
    setHex(newHex);
    debouncedConvert(newHex, "hex");
  };

  const handleAlphaChange = (e) => {
    const newAlpha = Math.max(0, Math.min(1, parseFloat(e.target.value) || 0)).toFixed(2);
    setAlpha(newAlpha);
    const newHex = `${hex.substring(0, 7)}${Math.round(parseFloat(newAlpha) * 255).toString(16).padStart(2, "0")}`;
    setHex(newHex);
    debouncedConvert(newHex, "hex");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Color Converter</h1>
      <p className="text-gray-600 mb-6">
        Convert colors between different formats using the color picker or editable fields.
      </p>

      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <div className="space-y-4">
          {/* Color Picker and Alpha Slider */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="color"
                value={hex.substring(0, 7)}
                onChange={handleColorPickerChange}
                className="w-16 h-16 p-0 border-none cursor-pointer"
                style={{ backgroundColor: hex.substring(0, 7) }}
              />
              <span
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-mono pointer-events-none"
                style={{ color: lch.split(" ")[0].replace("lch(", "").replace("%", "") > 50 ? "#000" : "#fff" }}
              >
                {hex.substring(0, 7)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium">Opacity:</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={alpha}
                onChange={handleAlphaChange}
                onFocus={() => handleFocus("alpha")}
                onBlur={() => handleBlur(alpha, "hex")}
                className="w-32"
              />
              <input
                type="text"
                value={alpha}
                onChange={handleAlphaChange}
                onFocus={() => handleFocus("alpha")}
                onBlur={() => handleBlur(alpha, "hex")}
                className="w-16 p-2 border rounded text-center"
              />
            </div>
          </div>

          {/* Output Fields */}
          {[
            { label: "HEX", value: hex, setter: setHex, format: "hex" },
            { label: "RGB", value: rgb, setter: setRgb, format: "rgb" },
            { label: "HSL", value: hsl, setter: setHsl, format: "hsl" },
            { label: "HWB", value: hwb, setter: setHwb, format: "hwb" },
            { label: "LCH", value: lch, setter: setLch, format: "lch" },
            { label: "CMYK", value: cmyk, setter: setCmyk, format: "cmyk" },
            { label: "CSS", value: css, setter: setCss, format: "css" },
          ].map(({ label, value, setter, format }) => (
            <div key={label} className="flex items-center gap-4">
              <label className="w-20 font-medium">{label}:</label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleInputChange(e.target.value, format, setter)}
                onFocus={() => handleFocus(format)}
                onBlur={() => handleBlur(value, format)}
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={() => copyToClipboard(value)}
                disabled={!value}
                className={`p-2 rounded ${value ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                Copy
              </button>
            </div>
          ))}

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}