import React from "react";
import ToolExecutor from "../../components/ToolExecutor";

export default function BasicAuthGenerator() {
  return (
    <ToolExecutor
      toolName="basic-auth-generator"
      schemaInput={[
        { type: "text", autoRun: true },
        { type: "password", autoRun: true }
      ]}
      customRenderer={({ formData, setFormData, output }) => {
        const showPassword = formData.showPassword || false;

        return (
          <div className="min-h-screen py-12 px-4 flex justify-center">
            <div className="bg-white rounded-lg w-full max-w-lg space-y-6">
              <h1 className="text-2xl font-semibold text-gray-800">Basic auth generator</h1>
              <p className="text-gray-600">
                Generate a base64 basic auth header from a username and password.
              </p>

              {/* Username */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={formData.username || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Your username..."
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, username: "" })
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Clear username"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border rounded-md p-2 pr-10 focus:ring-2 focus:ring-green-400 outline-none"
                    value={formData.password || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Your password..."
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, password: "" })
                    }
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Clear password"
                  >
                    ✕
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, showPassword: !showPassword })
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Toggle password visibility"
                  >
                    {showPassword ? "👁" : "🙈"}
                  </button>
                </div>
              </div>

              {/* Output */}
              <div className="bg-gray-50 border rounded-md p-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Authorization header:</label>
                <code className="block text-gray-800 break-all">
                  {output?.result || "Authorization: Basic ..."}
                </code>
              </div>

              {/* Copy Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    if (output?.result) {
                      navigator.clipboard.writeText(output.result || "");
                    }
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                >
                  Copy header
                </button>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
