import React, { useState } from "react";
import ToolExecutor from "../../components/ToolExecutor";
import { ToastContainer, toast } from "react-toastify";

export default function BaseConverter() {
  const [customBase, setCustomBase] = useState(null); // Track custom base input

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  return (
    <ToolExecutor
      toolPath="base-converter"
      schemaInput={[
        {
          type: "text",
          name: "number",
          label: "Number to convert",
          placeholder: "Enter number (e.g., 255, FF, 11111111)",
          autoRun: true,
        },
        {
          type: "number",
          name: "inputBase",
          label: "Input base (2-64)",
          placeholder: "Enter base (e.g., 10 for decimal, 16 for hex)",
          min: 2,
          max: 64,
          autoRun: true,
        },
      ]}
      customRenderer={({ formData, setFormData, output }) => {
        // Parse the input number string as an integer for default custom base
        const defaultCustomBase = Math.min(
          parseInt(formData.number) || 64,
          64
        );

        return (
          <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
            {/* Input fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number to convert
                </label>
                <input
                  type="text"
                  className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                  value={formData.number || ""}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="Enter number (e.g., 255, FF, 11111111)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Input base (2-64)
                </label>
                <input
                  type="number"
                  className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                  value={formData.inputBase || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, inputBase: parseInt(e.target.value) })
                  }
                  placeholder="Enter base (e.g., 10 for decimal, 16 for hex)"
                  min="2"
                  max="64"
                />
              </div>
              {output && !output.error && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom base (2-64)
                  </label>
                  <input
                    type="number"
                    className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                    value={
                      customBase !== null
                        ? customBase
                        : defaultCustomBase // Default to parsed input number, capped at 64
                    }
                    onChange={(e) => {
                      const newBase = parseInt(e.target.value);
                      setCustomBase(newBase);
                      setFormData({ ...formData, customBase: newBase });
                    }}
                    placeholder="Custom base (2-64)"
                    min="2"
                    max="64"
                  />
                </div>
              )}
            </div>

            {/* Output fields */}
            {output && !output.error && (
              <div className="space-y-2">
                {["binary", "octal", "decimal", "hexadecimal", "base64", "custom"].map((key) => (
                  <div key={key} className="flex justify-between bg-gray-100 px-3 py-2 rounded">
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">{output[key]}</span>
                      <button
                        onClick={() => handleCopy(output[key])}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                          <path
                            fill="currentColor"
                            d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {output?.error && <p className="text-red-600">{output.error}</p>}
            <ToastContainer position="bottom-center" autoClose={1000} />
          </div>
        );
      }}
    />
  );
}