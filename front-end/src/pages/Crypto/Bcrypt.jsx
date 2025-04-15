import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useDynamicToolLoader } from "../../hooks/useDynamicToolLoader";

export default function BcryptTool() {
  const [inputString, setInputString] = useState("");
  const [saltRounds, setSaltRounds] = useState(10);
  const [hashedValue, setHashedValue] = useState("");

  const [compareString, setCompareString] = useState("");
  const [compareHash, setCompareHash] = useState("");
  const [isMatch, setIsMatch] = useState(false);
  const bcryptFn = useDynamicToolLoader("bcrypt", "bcryptTool");


  useEffect(() => {
    const doHash = async () => {
      if (bcryptFn) {
        try {
          const result = await bcryptFn({
            mode: "hash",
            input: inputString,
            saltRounds: saltRounds
          });
          console.log("Hash result:", result);
          setHashedValue(result.hash);
        } catch (error) {
          console.error("Error hashing string:", error);
          setHashedValue("");
        }
      }
    };

    doHash();
  }, [inputString, saltRounds, bcryptFn]);

  useEffect(() => {
    const doCompare = async () => {
      if (bcryptFn) {
        try {
          const result = await bcryptFn({
            mode: "compare",
            input: compareString,
            hash: compareHash,
          });
          setIsMatch(result.match);
        } catch (error) {
          console.error("Error comparing string:", error);
          setIsMatch(null);
        }
      }
    };

    doCompare();
  }, [compareString, compareHash, bcryptFn]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Bcrypt</h1>
      <p className="text-sm text-gray-600 mb-4">
        Hash and compare text string using bcrypt. Bcrypt is a password-hashing function based on the Blowfish cipher.
      </p>
      <div>
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold mb-2">Hash</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 whitespace-nowrap">Your string:</span>
            <Input
              value={inputString}
              onChange={(e) => setInputString(e.target.value)}
              type="text"
              placeholder="Your string to hash..."
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 whitespace-nowrap">Salt count:</span>
            <Input
              type="number"
              value={saltRounds}
              onChange={(e) => setSaltRounds(Number(e.target.value))}
              min={1}
              max={20}
            />
          </div>

          <div className="space-y-4">
            <Input value={hashedValue}
              readOnly />
            <Button
              variant="primary"
              //onclick là copy vào clipboard
              onClick={() => {
                navigator.clipboard.writeText(hashedValue).then(() => {
                  toast.success("Copied to clipboard!");
                });
              }}
            >
              Copy hash
            </Button>
            <ToastContainer position="bottom-center" autoClose={1000} />
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold mb-2">Compare</h2>
          <Input
            placeholder="Your string to compare..."
            value={compareString}
            onChange={(e) => setCompareString(e.target.value)}
          />
          <Input
            placeholder="Your hash to compare..."
            value={compareHash}
            onChange={(e) => setCompareHash(e.target.value)}
          />
          {isMatch !== null && (
            <p className="text-sm font-semibold">
              Do they match?{' '}
              <span className={isMatch ? "text-green-600" : "text-red-600"}>
                {isMatch ? "Yes" : "No"}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 
