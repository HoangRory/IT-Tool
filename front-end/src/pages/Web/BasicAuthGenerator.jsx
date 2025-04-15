import React, { useState } from "react";
import { useDynamicToolLoader } from "../../hooks/useDynamicToolLoader";
import { useEffect } from "react";

const BasicAuthGenerator = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authHeader, setAuthHeader] = useState("");
  const generateAuthHeader = useDynamicToolLoader("basic-auth-generator", "generateBasicAuthHeader");


  const copyToClipboard = () => {
    navigator.clipboard.writeText(authHeader);
  };

  useEffect(() => {
    if (generateAuthHeader && username && password) {
      try {
        const result = generateAuthHeader(username, password); // vì generateAuthHeader không phải async
        setAuthHeader(result);
      } catch (error) {
        setAuthHeader("Error: " + error.message);
      }
    } else {
      setAuthHeader("");
    }
  }, [username, password, generateAuthHeader]);

  return (
    <div className="min-h-screen py-12 px-4 flex justify-center">
      <div className="bg-white rounded-lg w-full max-w-lg space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Basic auth generator</h1>
        <p className="text-gray-600">
          Generate a base64 basic auth header from a username and password.
        </p>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Username</label>
          <div className="relative"> 
            <input
                type="text"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Your username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button
                type="button"
                onClick={() => setUsername("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Clear password">
                ✕
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-md p-2 pr-10 focus:ring-2 focus:ring-green-400 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password..."
            />
            <button
              type="button"
              onClick={() => setPassword("")}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Clear password"
            >
              ✕
            </button>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Toggle password"
            >
              {showPassword ? "👁" : "🙈"}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 border rounded-md p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Authorization header:</label>
          <code className="block text-gray-800 break-all">
            {authHeader || "Authorization: Basic ..."}
          </code>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              generateAuthHeader();
              setTimeout(copyToClipboard, 100); // Copy sau khi set
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
          >
            Copy header
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicAuthGenerator;
