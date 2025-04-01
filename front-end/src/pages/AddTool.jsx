import React, { useState } from "react";
import axios from "axios";

export default function AddTool() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a DLL file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/tools/upload-plugin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data || "Failed to upload plugin.");
      setMessage("");
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen pt-8">
      <div className="w-full max-w-md p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Add New Tool</h2>
        <p className="text-sm text-center text-gray-600 mt-2">
          Upload a .dll file to add a new tool to the system.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 p-6 border border-gray-300 rounded-lg shadow-md bg-white">
          <div className="mb-4">
            <label htmlFor="pluginFile" className="block text-gray-700 font-medium mb-2">
              Select DLL File:
            </label>
            <input
              type="file"
              id="pluginFile"
              accept=".dll"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-black text-white font-semibold rounded-md shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Upload Plugin
          </button>
        </form>
        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      </div>
    </div>
  );
}