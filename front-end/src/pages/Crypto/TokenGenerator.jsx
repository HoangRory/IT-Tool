import React, { useState, useEffect } from "react";
import ToolExecutor from "../../components/ToolExecutor";
import { ToastContainer, toast } from "react-toastify";

export default function TokenGenerator() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Token copied to clipboard!");
    });
  };

  const handleRefresh = (setFormData, formData) => {
    const newTrigger = refreshTrigger + 1;
    setRefreshTrigger(newTrigger);
    setFormData({ ...formData, refreshTrigger: newTrigger }); // Explicitly update formData
    console.log("Refresh triggered, new refreshTrigger:", newTrigger);
  };

  return (
    <ToolExecutor
      toolPath="token-generator"
      initialInput={{
        withUppercase: true,
        withLowercase: true,
        withNumbers: true,
        withSymbols: false,
        length: 64,
        refreshTrigger: 0,
      }}
      schemaInput={[
        {
          type: "checkbox",
          name: "withUppercase",
          label: "Uppercase (A-Z)",
          autoRun: true,
        },
        {
          type: "checkbox",
          name: "withLowercase",
          label: "Lowercase (a-z)",
          autoRun: true,
        },
        {
          type: "checkbox",
          name: "withNumbers",
          label: "Numbers (0-9)",
          autoRun: true,
        },
        {
          type: "checkbox",
          name: "withSymbols",
          label: "Symbols (!-...)",
          autoRun: true,
        },
        {
          type: "range",
          name: "length",
          label: `Length`,
          min: 1,
          max: 512,
          step: 1,
          autoRun: true,
        },
        {
          type: "hidden",
          name: "refreshTrigger",
          value: refreshTrigger,
          autoRun: true,
        },
      ]}
      customRenderer={({ formData, setFormData, output }) => {
        // Log formData and output to debug
        useEffect(() => {
          console.log("formData:", formData);
          console.log("output:", output);
        }, [formData, output]);

        return (
          <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
            <div className="flex justify-center gap-8">
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.withUppercase || false}
                    onChange={(e) => setFormData({ ...formData, withUppercase: e.target.checked })}
                  />
                  Uppercase (A-Z)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.withLowercase || false}
                    onChange={(e) => setFormData({ ...formData, withLowercase: e.target.checked })}
                  />
                  Lowercase (a-z)
                </label>
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.withNumbers || false}
                    onChange={(e) => setFormData({ ...formData, withNumbers: e.target.checked })}
                  />
                  Numbers (0-9)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.withSymbols || false}
                    onChange={(e) => setFormData({ ...formData, withSymbols: e.target.checked })}
                  />
                  Symbols (!-...)
                </label>
              </div>
            </div>

            <div className="mt-4">
              <label className="block mb-2">
                Length ({formData.length || 64})
              </label>
              <input
                type="range"
                min="1"
                max="512"
                step="1"
                value={formData.length || 64}
                onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            {output && !output.error && (
              <div className="mt-4">
                <textarea
                  readOnly
                  value={output.token}
                  placeholder="Your generated token will appear here..."
                  className="w-full border p-2 rounded text-center font-mono resize-none"
                  rows={3}
                  style={{ minHeight: "80px" }}
                />
              </div>
            )}

            {output?.error && <p className="text-red-600 mt-4">{output.error}</p>}

            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => handleCopy(output?.token || "")}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                disabled={!output?.token}
              >
                Copy Token
              </button>
              <button
                onClick={() => handleRefresh(setFormData, formData)}
                className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
              >
                Refresh Token
              </button>
            </div>

            <ToastContainer position="bottom-center" autoClose={1000} />
          </div>
        );
      }}
    />
  );
}