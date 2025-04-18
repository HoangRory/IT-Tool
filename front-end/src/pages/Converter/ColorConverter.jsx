import React, { useState, useEffect } from "react";
import { Colord, extend } from "colord";
import cmykPlugin from "colord/plugins/cmyk";
import hwbPlugin from "colord/plugins/hwb";
import lchPlugin from "colord/plugins/lch";
import namesPlugin from "colord/plugins/names";

// Extend Colord with plugins
extend([cmykPlugin, hwbPlugin, lchPlugin, namesPlugin]);

export default function ColorConverter() {
  const [hex, setHex] = useState("#ff0000ff");
  const [rgb, setRgb] = useState("rgb(255, 0, 0)");
  const [hsl, setHsl] = useState("hsl(0, 100%, 50%)");
  const [hwb, setHwb] = useState("hwb(0 0% 0%)");
  const [lch, setLch] = useState("lch(54 106 40)");
  const [cmyk, setCmyk] = useState("cmyk(0%, 100%, 100%, 0%)");
  const [css, setCss] = useState("red");
  const [alpha, setAlpha] = useState("1.00");
  const [error, setError] = useState("");
  const [activeField, setActiveField] = useState(null);

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Parse and convert color
  const convertColor = (input, format) => {
    setError("");
    if (!input.trim()) return;

    try {
      let colord;
      switch (format) {
        case "hex":
          colord = new Colord(input);
          break;
        case "rgb":
          colord = new Colord(input);
          break;
        case "hsl":
          colord = new Colord(input);
          break;
        case "hwb":
          colord = new Colord(input);
          break;
        case "lch":
          colord = new Colord(input);
          break;
        case "cmyk":
          colord = new Colord(input);
          break;
        case "css":
          const normalizedInput = input.toLowerCase().trim();
          colord = new Colord(normalizedInput);
          if (!colord.isValid()) throw new Error("Unknown CSS color name");
          break;
        default:
          throw new Error("Unsupported color format");
      }

      if (!colord.isValid()) throw new Error("Invalid color format");

      updateFields(colord);
    } catch (err) {
      setError(err.message || "Invalid color format");
    }
  };

  // Update all fields based on Colord object
  const updateFields = (colord) => {
    const normalize = (str) => str.replace(/\s+/g, " ").toLowerCase();
    const newHex = colord.toHex();
    const newRgb = colord.alpha() < 1 ? colord.toRgbString().replace("rgba", "rgb") : colord.toRgbString().replace("rgba", "rgb");
    const newHsl = colord.alpha() < 1 ? colord.toHslString().replace("hsla", "hsl") : colord.toHslString().replace("hsla", "hsl");
    const newHwb = colord.alpha() < 1 ? `${colord.toHwbString().replace("hwb(", "hwb(")}, ${colord.alpha().toFixed(2)})` : colord.toHwbString();
    const newLch = colord.alpha() < 1 ? `${colord.toLchString().replace("lch(", "lch(")}, ${colord.alpha().toFixed(2)})` : colord.toLchString();
    const newCmyk = colord.alpha() < 1 ? `${colord.toCmykString().replace("cmyk(", "cmyk(")}, ${colord.alpha().toFixed(2)})` : colord.toCmykString();
    const newCss = colord.toName({ closest: true }) ?? 'Unknown'; 
    const newAlpha = colord.alpha().toFixed(2);

    if (activeField !== "hex" && normalize(newHex) !== normalize(hex)) setHex(newHex);
    if (activeField !== "rgb" && normalize(newRgb) !== normalize(rgb)) setRgb(newRgb);
    if (activeField !== "hsl" && normalize(newHsl) !== normalize(hsl)) setHsl(newHsl);
    if (activeField !== "hwb" && normalize(newHwb) !== normalize(hwb)) setHwb(newHwb);
    if (activeField !== "lch" && normalize(newLch) !== normalize(lch)) setLch(newLch);
    if (activeField !== "cmyk" && normalize(newCmyk) !== normalize(cmyk)) setCmyk(newCmyk);
    if (activeField !== "css" && normalize(newCss) !== normalize(css)) setCss(newCss);
    if (activeField !== "hex" && activeField !== "alpha" && newAlpha !== alpha) setAlpha(newAlpha);
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
    setActiveField(null);
    debouncedConvert(value, format);
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

  // Calculate text color for picker based on luminance
  const getTextColor = () => {
    const colord = new Colord(hex);
    const { r, g, b } = colord.toRgb();
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000" : "#fff";
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
                style={{ color: getTextColor() }}
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