import React from "react";
import ToolExecutor from "../../components/ToolExecutor";
import { ToastContainer, toast } from "react-toastify";

export default function CreditCardValidatorAndParser() {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  const creditCardExamples = [
    "4532015112830366", // Visa
    "5555555555554444", // MasterCard
    "378282246310005",  // American Express
  ];

  return (
    <ToolExecutor
      toolPath="credit-card-validator-and-parser"
      schemaInput={[
        {
          type: "text",
          name: "cardNumber",
          label: "Credit Card Number",
          placeholder: "Enter a credit card number to check for validity...",
          autoRun: true,
        },
      ]}
      customRenderer={({ formData, setFormData, output }) => (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <input
            type="text"
            className="w-full border p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
            value={formData.cardNumber || ""}
            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
            placeholder="Enter a credit card number to check for validity..."
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
            <h3 className="font-semibold text-gray-700 mb-2">Valid Credit Card Examples:</h3>
            <div className="space-y-2">
              {creditCardExamples.map((cardNumber) => (
                <div key={cardNumber} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded">
                  <span className="text-gray-700 font-mono">{cardNumber.replace(/\d(?=\d{4})/g, "*")}</span>
                  <button
                    onClick={() => handleCopy(cardNumber)}
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