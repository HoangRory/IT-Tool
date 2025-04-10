import React, { useState, useEffect } from "react";
import {toast, ToastContainer} from "react-toastify";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function BcryptTool() {
  const [inputString, setInputString] = useState("");
  const [saltRounds, setSaltRounds] = useState(10);
  const [hashedValue, setHashedValue] = useState("");

  const [compareString, setCompareString] = useState("");
  const [compareHash, setCompareHash] = useState("");
  const [isMatch, setIsMatch] = useState(null);


  useEffect(() => {
    if (!compareString || !compareHash) {
      setIsMatch(null);
      return;
    }
  
    const fetchCompare = async () => {
    try {
      const response = await fetch("http://localhost:5074/api/tools/bcrypt-compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: compareString,
          hash: compareHash
        })
      });
  
      if (!response.ok) throw new Error("Error comparing hash");
  
      const result = await response.json();
      setIsMatch(result.match);
    } catch (error) {
      console.error("Comparing error:", error);
      setIsMatch(null);
    }}
    fetchCompare();
  }, [compareString, compareHash]);

  useEffect(() => {
    if (!inputString) {
      setHashedValue("");
      return;
    }

    const fetchHash = async () => {
      try {
        const response = await fetch("http://localhost:5074/api/tools/bcrypt-hash", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            input: inputString,
            saltRounds: saltRounds
          })
        });

        if (!response.ok) throw new Error("Error fetching hash");

        const result = await response.json();
        setHashedValue(result.hash || {});
      } catch (error) {
        console.error("Hashing error:", error);
        setHashedValue("");
      }
    };

    fetchHash();
    }, [inputString, saltRounds]);


  return (
    <div className="max-w-xl mx-auto p-6 space-y-10">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Hash</h2>
        <p className="text-sm text-gray-600 mb-4">
          Hash and compare text string using bcrypt. Bcrypt is a password-hashing function based on the Blowfish cipher.
        </p>
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 whitespace-nowrap">Your string:</span>
                <Input
                    value ={inputString}
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
              <Input value={hashedValue} readOnly  />
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
        <h2 className="text-2xl font-semibold mb-2">Compare string with hash</h2>
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
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
