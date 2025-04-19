import React from "react";
import ToolExecutor from "../../components/ToolExecutor";
import { ToastContainer, toast } from "react-toastify";

export default function RomanNumeralConverter() {
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copied to clipboard!`);
    });
  };

  return (
    <ToolExecutor
      toolPath="roman-numeral-converter"
      initialInput={{
        arabic: 42,
        roman: "XLII",
      }}
      schemaInput={[
        {
          type: "number",
          name: "arabic",
          label: "Arabic Number",
          placeholder: "Enter a number (1-3999)",
          autoRun: true,
        },
        {
          type: "text",
          name: "roman",
          label: "Roman Numeral",
          placeholder: "Enter a Roman numeral (e.g., XLII)",
          autoRun: true,
        },
      ]}
      customRenderer={({ formData, setFormData, output }) => (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
          <div className="border rounded p-4">
            <h2 className="text-xl font-semibold mb-4">Arabic to Roman</h2>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <input
                  type="number"
                  value={formData.arabic || ""}
                  onChange={(e) => setFormData({ ...formData, arabic: Number(e.target.value) })}
                  placeholder="Enter a number (1-3999)"
                  className="w-full border p-2 rounded"
                  min="1"
                  max="3999"
                />
                {output?.arabicError && (
                  <p className="text-red-600 text-sm mt-1">{output.arabicError}</p>
                )}
              </div>
              <div className="text-2xl font-mono">{output?.roman || ""}</div>
              <button
                onClick={() => handleCopy(output?.roman || "", "Roman number")}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                disabled={!output?.roman}
              >
                Copy
              </button>
            </div>
          </div>

          <div className="border rounded p-4">
            <h2 className="text-xl font-semibold mb-4">Roman to Arabic</h2>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.roman || ""}
                  onChange={(e) => setFormData({ ...formData, roman: e.target.value.toUpperCase() })}
                  placeholder="Enter a Roman numeral (e.g., XLII)"
                  className="w-full border p-2 rounded"
                />
                {output?.romanError && (
                  <p className="text-red-600 text-sm mt-1">{output.romanError}</p>
                )}
              </div>
              <div className="text-2xl font-mono">{output?.arabic || ""}</div>
              <button
                onClick={() => handleCopy(String(output?.arabic || ""), "Arabic number")}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                disabled={!output?.arabic}
              >
                Copy
              </button>
            </div>
          </div>

          <ToastContainer position="bottom-center" autoClose={1000} />
        </div>
      )}
    />
  );
}