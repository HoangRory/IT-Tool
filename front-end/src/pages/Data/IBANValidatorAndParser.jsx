import React from "react";
import ToolExecutor from "../../components/ToolExecutor";
import { ToastContainer, toast } from "react-toastify";
import { friendlyFormatIBAN } from 'ibantools';

export default function IbanValidatorAndParser() {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  const ibanExamples = [
    'FR7630006000011234567890189',
    'DE89370400440532013000',
    'GB29NWBK60161331926819',
  ];

  return (
    <ToolExecutor
      toolPath="iban-validator-and-parser"
      schemaInput={[
        {
          type: "text",
          name: "iban",
          label: "IBAN",
          placeholder: "Enter an IBAN to check for validity...",
          autoRun: true,
        },
      ]}
      customRenderer={({ formData, setFormData, output }) => (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <input
            type="text"
            className="w-full border p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
            value={formData.iban || ""}
            onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
            placeholder="Enter an IBAN to check for validity..."
          />

          {output && !output.error && (
            <div className="space-y-2">
              {output.details.map(({ label, value }) => (
                <div key={label} className="flex justify-between bg-gray-100 px-3 py-2 rounded">
                  <span>{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">
                      {Array.isArray(value) ? value.join(', ') : value?.toString() || 'Unknown'}
                    </span>
                    {value && !Array.isArray(value) && (
                      <button
                        onClick={() => handleCopy(value.toString())}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                          <path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {output?.error && <p className="text-red-600">{output.error}</p>}

          <div className="mt-5">
            <h3 className="font-semibold text-gray-700 mb-2">Valid IBAN Examples:</h3>
            <div className="space-y-2">
              {ibanExamples.map((iban) => (
                <div key={iban} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded">
                  <span className="text-gray-700 font-mono">{friendlyFormatIBAN(iban)}</span>
                  <button
                    onClick={() => handleCopy(iban)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                      <path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <ToastContainer position="bottom-center" autoClose={1000} />
        </div>
      )}
    />
  );
}