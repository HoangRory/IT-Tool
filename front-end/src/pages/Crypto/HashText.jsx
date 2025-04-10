import { useState, useEffect } from "react";

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

export default function HashText() {
  const [inputText, setInputText] = useState("");
  const [hashResults, setHashResults] = useState({});
  const [selectedEncoding, setSelectedEncoding] = useState(Object.keys(encodingOptions)[0]); // Lưu tên hiển thị
  const [isOpen, setIsOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {

    const fetchHash = async () => {
      try {
        const response = await fetch("http://localhost:5074/api/tools/hash-text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            input: inputText,
            encoding: encodingOptions[selectedEncoding] // Lấy giá trị thực tế (Hex, Base64...)
          })
        });

        if (!response.ok) throw new Error("Error fetching hash");

        const result = await response.json();
        setHashResults(result.output || {});
      } catch (error) {
        console.error("Hashing error:", error);
        setHashResults({});
      }
    };

    fetchHash();
  }, [inputText, selectedEncoding]);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 1500);
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold">Hash Text</h2>
      <p className="text-gray-600">
        Hash a text string using: MD5, SHA1, SHA256, SHA224, SHA512, SHA384, SHA3, or RIPEMD160.
      </p>

      {/* Input Text */}
      <textarea
        className="w-full p-2 mt-4 border rounded"
        placeholder="Your string to hash..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      {/* Digest Encoding - Custom Dropdown */}
      <div className="mt-4 relative w-full">
        <label className="font-medium">Digest Encoding:</label>
        <div
          className="flex items-center justify-between border rounded p-2 bg-white shadow cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          tabIndex="0"
        >
          <span className="truncate">{selectedEncoding}</span>
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
                className={`px-4 py-2 cursor-pointer ${
                  selectedEncoding === key ? "bg-gray-200 font-bold" : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  setSelectedEncoding(key);
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
              value={hashResults[algo] || ""}
              readOnly
              className="flex-1 ml-2 bg-gray-100 p-1 rounded"
            />
            <button
              onClick={() => handleCopy(hashResults[algo])}
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
  );
}
