import React from "react";
import ToolExecutor from "../../components/ToolExecutor";
import { ToastContainer, toast } from "react-toastify";

export default function MacAddressLookup() {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Vendor info copied to clipboard!");
    });
  };

  return (
    <ToolExecutor
      toolPath="mac-address-lookup"
      schemaInput={[
        {
          type: "text",
          name: "macAddress",
          label: "MAC Address",
          placeholder: "Enter MAC address (e.g., 00-14-22-04-25-37)",
          autoRun: true,
        },
      ]}
      customRenderer={({ formData, setFormData, output }) => (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          {/* Input field */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MAC Address
              </label>
              <input
                type="text"
                className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                value={formData.macAddress || ""}
                onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
                placeholder="Enter MAC address (e.g., 00-14-22-04-25-37)"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Output fields */}
          {output && !output.error && output.vendorInfo && (
            <div className="space-y-2">
              <div className="bg-gray-100 px-3 py-2 rounded">
                <div className="font-semibold text-gray-700 mb-1">Vendor Information:</div>
                <div className="text-lg text-gray-700 space-y-1">
                  {output.vendorInfo.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
                <div className="flex justify-center mt-3">
                  <button
                    onClick={() => handleCopy(output.vendorInfo)}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="inline">
                      <path
                        fill="currentColor"
                        d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"
                      ></path>
                    </svg>
                    Copy vendor info
                  </button>
                </div>
              </div>
            </div>
          )}

          {output?.error && (
            <div className="bg-gray-100 px-3 py-2 rounded text-gray-600 italic opacity-60">
              {output.error === "Unknown vendor for this address"
                ? "Unknown vendor for this address"
                : output.error}
            </div>
          )}
          <ToastContainer position="bottom-center" autoClose={1000} />
        </div>
      )}
    />
  );
}