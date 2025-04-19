import React from "react";
import ToolExecutor from "../../components/ToolExecutor";
import { ToastContainer, toast } from "react-toastify";

export default function QRCodeGenerator() {
  const handleDownload = (dataUrl) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "qr-code.png";
    link.click();
    toast.success("QR code downloaded!");
  };

  const errorCorrectionLevels = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "Quartile", value: "quartile" },
    { label: "High", value: "high" },
  ];

  return (
    <ToolExecutor
      toolPath="qr-code-generator"
      initialInput={{
        text: "https://it-tools.tech",
        foreground: "#000000ff",
        background: "#ffffffff",
        errorCorrectionLevel: "medium",
      }}
      schemaInput={[
        {
          type: "textarea",
          name: "text",
          label: "Text or URL",
          placeholder: "Your link or text...",
          autoRun: true,
        },
        {
          type: "text",
          name: "foreground",
          label: "Foreground Color",
          placeholder: "#000000ff",
          autoRun: true,
        },
        {
          type: "text",
          name: "background",
          label: "Background Color",
          placeholder: "#ffffffff",
          autoRun: true,
        },
        {
          type: "select",
          name: "errorCorrectionLevel",
          label: "Error Resistance",
          options: errorCorrectionLevels,
          autoRun: true,
        },
      ]}
      customRenderer={({ formData, setFormData, output }) => (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              <div>
                <label className="block mb-2">Text or URL</label>
                <textarea
                  value={formData.text || ""}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Your link or text..."
                  className="w-full border p-2 rounded resize-y"
                  rows={2}
                />
              </div>
              <div>
                <label className="block mb-2">Foreground Color</label>
                <input
                  type="color"
                  value={formData.foreground || "#000000ff"}
                  onChange={(e) => setFormData({ ...formData, foreground: e.target.value })}
                  className="w-20 h-10 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Background Color</label>
                <input
                  type="color"
                  value={formData.background || "#ffffffff"}
                  onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                  className="w-20 h-10 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Error Resistance</label>
                <select
                  value={formData.errorCorrectionLevel || "medium"}
                  onChange={(e) => setFormData({ ...formData, errorCorrectionLevel: e.target.value })}
                  className="w-full border p-2 rounded"
                >
                  {errorCorrectionLevels.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              {output && !output.error && (
                <>
                  <img
                    src={output.qrcode}
                    alt="QR Code"
                    style={{ width: "200px", height: "200px" }}
                  />
                  <button
                    onClick={() => handleDownload(output.qrcode)}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                  >
                    Download QR Code
                  </button>
                </>
              )}
              {output?.error && <p className="text-red-600">{output.error}</p>}
            </div>
          </div>
          <ToastContainer position="bottom-center" autoClose={1000} />
        </div>
      )}
    />
  );
}