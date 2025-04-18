import React from "react";
import ToolExecutor from "../../components/ToolExecutor";
import { ToastContainer, toast } from "react-toastify";

export default function IPv4AddressConverter() {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  return (
    <ToolExecutor
      toolPath="ipv4-address-converter"
      schemaInput={[
        {
          type: "text",
          name: "ipAddress",
          label: "IPv4 Address",
          placeholder: "Enter IPv4 address (e.g., 192.168.1.1)",
          autoRun: true,
        },
      ]}
      customRenderer={({ formData, setFormData, output }) => (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          {/* Input field */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IPv4 Address
              </label>
              <input
                type="text"
                className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                value={formData.ipAddress || ""}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                placeholder="Enter IPv4 address (e.g., 192.168.1.1)"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Output fields */}
          {output && !output.error && output.results && (
            <div className="space-y-2">
              {[
                { key: "decimal", label: "Decimal" },
                { key: "hexadecimal", label: "Hexadecimal" },
                { key: "binary", label: "Binary" },
                { key: "ipv6", label: "IPv6" },
                { key: "ipv6Short", label: "IPv6 (short)" },
              ].map(({ key, label }) => (
                <div key={key} className="flex justify-between bg-gray-100 px-3 py-2 rounded">
                  <span>{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">{output.results[key]}</span>
                    <button
                      onClick={() => handleCopy(output.results[key])}
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

          {output?.error && (
            <div className="bg-gray-100 px-3 py-2 rounded text-gray-600 italic opacity-60">
              {output.error}
            </div>
          )}
          <ToastContainer position="bottom-center" autoClose={1000} />
        </div>
      )}
    />
  );
}