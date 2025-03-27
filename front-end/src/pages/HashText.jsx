import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

const encodingOptions = [
  "Hexadecimal (base 16)",
  "Binary (base 2)",
  "Base64 (base 64)",
  "Base64url (base 64 URL safe)"
];

const hashAlgorithms = [
  { name: "MD5", method: CryptoJS.MD5 },
  { name: "SHA1", method: CryptoJS.SHA1 },
  { name: "SHA256", method: CryptoJS.SHA256 },
  { name: "SHA224", method: CryptoJS.SHA224 },
  { name: "SHA512", method: CryptoJS.SHA512 },
  { name: "SHA384", method: CryptoJS.SHA384 },
  { name: "SHA3", method: CryptoJS.SHA3 },
  { name: "RIPEMD160", method: CryptoJS.RIPEMD160 },
];

export default function HashText() {
  const [inputText, setInputText] = useState("");
  const [hashResults, setHashResults] = useState({});
  const [encoding, setEncoding] = useState(encodingOptions[0]);
  const [copyStatus, setCopyStatus] = useState("");

  // Chuyển từ Hex sang Binary
  const hexToBinary = (hexString) => {
    return hexString
      .split("")
      .map((char) => parseInt(char, 16).toString(2).padStart(4, "0"))
      .join("");
  };

  // Hàm hash tự động chạy khi inputText hoặc encoding thay đổi
  useEffect(() => {
    const handleHash = (text) => {
      const newHashResults = {};

      hashAlgorithms.forEach(({ name, method }) => {
        let hashedValue = method(text).toString(CryptoJS.enc.Hex); // Mặc định Hex

        switch (encoding) {
          case "Binary (base 2)":
            hashedValue = hexToBinary(hashedValue);
            break;
          case "Base64 (base 64)":
            hashedValue = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(hashedValue));
            break;
          case "Base64url (base 64 URL safe)":
            hashedValue = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(hashedValue))
              .replace(/\+/g, "-")
              .replace(/\//g, "_")
              .replace(/=+$/, "");
            break;
          default:
            break;
        }

        newHashResults[name] = hashedValue;
      });

      setHashResults(newHashResults);
    };

    handleHash(inputText);
  }, [inputText, encoding]); // Chạy lại khi input hoặc encoding thay đổi

  const handleCopy = (text) => {
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

      {/* Digest Encoding */}
      <div className="mt-4">
        <label className="font-medium">Digest Encoding:</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={encoding}
          onChange={(e) => setEncoding(e.target.value)}
        >
          {encodingOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {/* Hash Results */}
        <div className="space-y-2 mt-2">
          {hashAlgorithms.map(({ name }) => (
            <div key={name} className="flex items-center justify-between p-2 border rounded">
              <span className="font-semibold">{name}</span>
              <input
                type="text"
                value={hashResults[name] || ""}
                readOnly
                className="flex-1 ml-2 bg-gray-100 p-1 rounded"
              />
              <button
                onClick={() => handleCopy(hashResults[name])}
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
}
