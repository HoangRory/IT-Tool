import React, { useState } from "react";
import ToolExecutor from "../../components/ToolExecutor";
import { ToastContainer, toast } from "react-toastify";

export default function TemperatureConverter() {
  const [lastChangedUnit, setLastChangedUnit] = useState(null); // Track last changed unit

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  const units = [
    { key: "kelvin", label: "Kelvin (K)" },
    { key: "celsius", label: "Celsius (°C)" },
    { key: "fahrenheit", label: "Fahrenheit (°F)" },
    { key: "rankine", label: "Rankine (°R)" },
    { key: "delisle", label: "Delisle (°De)" },
    { key: "newton", label: "Newton (°N)" },
    { key: "reaumur", label: "Réaumur (°Ré)" },
    { key: "romer", label: "Rømer (°Rø)" },
  ];

  return (
    <ToolExecutor
      toolPath="temperature-converter"
      schemaInput={units.map(({ key, label }) => ({
        type: "number",
        name: key,
        label,
        placeholder: `Enter ${label}`,
        autoRun: true,
      }))}
      customRenderer={({ formData, setFormData, output }) => {
        // Update formData with output results to reflect conversions in input fields
        if (output && !output.error && output.results) {
          const newFormData = { ...formData };
          units.forEach(({ key }) => {
            if (key !== lastChangedUnit) {
              newFormData[key] = output.results[key];
            }
          });
          // Update formData only if it differs to avoid infinite loops
          if (JSON.stringify(newFormData) !== JSON.stringify(formData)) {
            setFormData(newFormData);
          }
        }

        return (
          <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
            {/* Input fields */}
            <div className="space-y-4">
              {units.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                      value={formData[key] || ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setLastChangedUnit(key);
                        setFormData({
                          ...formData,
                          [key]: isNaN(value) ? "" : value,
                          lastChangedUnit: key,
                        });
                      }}
                      placeholder={`Enter ${label}`}
                    />
                  </div>
                  <button
                    onClick={() => handleCopy(formData[key]?.toString() || "")}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-6"
                    disabled={!formData[key]}
                  >
                    <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                      <path
                        fill="currentColor"
                        d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"
                      ></path>
                    </svg>
                    Copy
                  </button>
                </div>
              ))}
            </div>

            {/* Error message */}
            {output?.error && (
              <div className="bg-gray-100 px-3 py-2 rounded text-gray-600 italic opacity-60">
                {output.error}
              </div>
            )}
            <ToastContainer position="bottom-center" autoClose={1000} />
          </div>
        );
      }}
    />
  );
}