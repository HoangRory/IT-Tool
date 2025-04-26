import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToolsContext } from "../../context/ToolsContext";
import { useContext } from "react";

export default function AddTool() {
  const { tools } = useContext(ToolsContext); // Access tools from ToolsContext

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    path: "",
    categoryId: "",
  });

  const [jsFile, setJsFile] = useState(null);
  const [inputSchemaFile, setInputSchemaFile] = useState(null);
  const [outputSchemaFile, setOutputSchemaFile] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {

  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (setter) => (e) => {
    setter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jsFile || !inputSchemaFile || !outputSchemaFile) {
      setError("Vui lòng chọn đầy đủ 3 tệp: JS, input schema, output schema.");
      return;
    }

    const fullData = new FormData();
    fullData.append("jsFile", jsFile);
    fullData.append("inputSchema", inputSchemaFile);
    fullData.append("outputSchema", outputSchemaFile);
    fullData.append("name", formData.name);
    fullData.append("description", formData.description);
    fullData.append("path", formData.path);
    fullData.append("categoryId", formData.categoryId);

    try {
      const res = await axios.post("/api/tools/upload-plugin", fullData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        setMessage("Upload successful!");
        setError("");
      } else {
        setMessage("");
        setError("Upload failed");
      }
    } catch (err) {
      setError(err.response?.data || "Upload failed.");
      setMessage("");
    }
  };

  return (
    <div className="flex justify-center min-h-screen pt-8">
      <div className="w-full max-w-xl p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Add New Tool</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 p-6 border rounded-lg shadow-md bg-white">
          <input
            type="text"
            name="name"
            placeholder="Tool Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md"
          />
          <input
            type="text"
            name="path"
            placeholder="Tool Path (e.g., /tools/mytool)"
            value={formData.path}
            onChange={handleChange}
            className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md"
          />
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md"
            required
          >
            <option value="" disabled>Select Category</option>
            {tools.map((cat, index) => (
              <option key={index} value={index}>{cat.category}</option>
            ))}

          </select>

          <label className="block font-medium">JS File:</label>
          <input type="file" accept=".js" onChange={handleFileChange(setJsFile)} className="w-full" required />

          <label className="block font-medium">Input Schema (JSON):</label>
          <input type="file" accept=".json" onChange={handleFileChange(setInputSchemaFile)} className="w-full" required />

          <label className="block font-medium">Output Schema (JSON):</label>
          <input type="file" accept=".json" onChange={handleFileChange(setOutputSchemaFile)} className="w-full" required />

          <button type="submit" className="w-full py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-800">
            Upload Tool
          </button>
        </form>

        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        {error && (
          <pre className="mt-4 text-center text-red-600 text-sm">
            {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
          </pre>
        )}

      </div>
    </div>
  );
}
