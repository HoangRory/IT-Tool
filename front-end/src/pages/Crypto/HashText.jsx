import ToolExecutor from "../../components/ToolExecutor";
import { useState } from "react";

export default function HashText() {
  return (
    <ToolExecutor
      toolName="hash-text"
      schemaInput={[
        { name: "input", label: "Text to hash", type: "textarea", placeholder: "Your string to hash...", autoRun: true },
        {
          name: "encoding",
          label: "Digest encoding",
          type: "select",
          options: [
            "Hexadecimal (base 16)",
            "Binary (base 2)",
            "Base64 (base 64)",
            "Base64url (base 64 URL safe)"
          ],
          defaultValue: "Hexadecimal (base 16)"
        }
      ]}
      customRenderer={({ formData, setFormData, output }) => {
        const encodingOptions = {
          "Hexadecimal (base 16)": "Hex",
          "Binary (base 2)": "Binary",
          "Base64 (base 64)": "Base64",
          "Base64url (base 64 URL safe)": "Base64url"
        };
        const algorithms = [
          "MD5",
          "SHA1",
          "SHA256",
          "SHA224",
          "SHA512",
          "SHA384",
          "SHA3",
          "RIPEMD160"
        ];
        const [isOpen, setIsOpen] = useState(false);
        const [copyStatus, setCopyStatus] = useState("");

        const handleCopy = (text) => {
          if (!text) return;
          navigator.clipboard.writeText(text).then(() => {
            setCopyStatus("Copied!");
            setTimeout(() => setCopyStatus(""), 1500);
          });
        };

        return (
          <div className="max-w-3xl mx-auto p-6 space-y-5">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Hash Text</h1>
            <p className="text-sm text-gray-600 mb-4"> Hash a text string using: MD5, SHA1, SHA256, SHA224, SHA512, SHA384, SHA3, or RIPEMD160.</p>

            <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
              {/* Input Text */}
              <textarea
                className="w-full p-2 mt-4 border rounded"
                placeholder="Your string to hash..."
                value={formData.input || ""}
                onChange={(e) => setFormData({ ...formData, input: e.target.value })}
              />

              {/* Digest Encoding - Custom Dropdown */}
              <div className="mt-4 relative w-full">
                <label className="font-medium">Digest Encoding:</label>
                <div
                  className="flex items-center justify-between border rounded p-2 bg-white shadow cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                  tabIndex="0"
                >
                  <span className="truncate">{formData.encoding || encodingOptions["Hexadecimal (base 16)"] }</span>
                  <svg
                    viewBox="0 0 24 24"
                    width="1.2em"
                    height="1.2em"
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42Z"></path>
                  </svg>
                </div>

                {isOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
                    {Object.keys(encodingOptions).map((key) => (
                      <div
                        key={key}
                        className={`px-4 py-2 cursor-pointer ${formData.encoding === key ? "bg-gray-200 font-bold" : "hover:bg-gray-100"
                          }`}
                        onClick={() => {
                          setFormData({ ...formData, encoding: encodingOptions[key] });
                          setIsOpen(false);
                        }}
                      >
                        {key}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hash Results */}
              <div className="space-y-2 mt-2">
                {algorithms.map((algo) => (
                  <div key={algo} className="flex items-center justify-between p-2 border rounded">
                    <span className="font-semibold">{algo}</span>
                    <input
                      type="text"
                      value={output?.[algo] || ""}
                      readOnly
                      className="flex-1 ml-2 bg-gray-100 p-1 rounded"
                    />
                    <button
                      onClick={() => handleCopy(output?.[algo])}
                      className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>

              {/* Copy Notification */}
              {copyStatus && (
                <div className="mt-2 text-green-500 font-medium">{copyStatus}</div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
