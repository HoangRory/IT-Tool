import React, { useEffect } from "react";
import ToolExecutor from "../../components/ToolExecutor";
import { ToastContainer, toast } from "react-toastify";

export default function ColorConverter() {
  const handleCopy = (text, format) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${format} copied to clipboard!`);
    });
  };

  return (
    <ToolExecutor
      toolPath="color-converter"
      initialInput={{
        picker: "#1ea54c",
        hex: "#1ea54c",
        rgb: "rgb(30, 165, 76)",
        hsl: "hsl(141, 69%, 38%)",
        name: "green",
      }}
      schemaInput={[
        {
          type: "color",
          name: "picker",
          label: "Color Picker",
          autoRun: true,
        },
        {
          type: "text",
          name: "hex",
          label: "Hex",
          placeholder: "e.g. #ff0000",
          autoRun: true,
        },
        {
          type: "text",
          name: "rgb",
          label: "RGB",
          placeholder: "e.g. rgb(255, 0, 0)",
          autoRun: true,
        },
        {
          type: "text",
          name: "hsl",
          label: "HSL",
          placeholder: "e.g. hsl(0, 100%, 50%)",
          autoRun: true,
        },
        {
          type: "text",
          name: "name",
          label: "CSS Name",
          placeholder: "e.g. red",
          autoRun: true,
        },
      ]}
      customRenderer={({ formData, setFormData, output }) => {
        // Log formData and output for debugging
        useEffect(() => {
          console.log("ColorConverter formData:", formData);
          console.log("ColorConverter output:", output);
        }, [formData, output]);

        // Sync formData with output to update input fields
        useEffect(() => {
          if (output) {
            const newFormData = {
              picker: output.picker || formData.picker,
              hex: output.hex || formData.hex,
              rgb: output.rgb || formData.rgb,
              hsl: output.hsl || formData.hsl,
              name: output.name || formData.name,
            };
            if (JSON.stringify(newFormData) !== JSON.stringify(formData)) {
              console.log("Updating formData with output:", newFormData);
              setFormData(newFormData);
            }
          }
        }, [output, formData, setFormData]);

        return (
          <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Color Picker</label>
                  <input
                    type="color"
                    value={formData.picker || "#1ea54c"}
                    onChange={(e) => setFormData({ ...formData, picker: e.target.value })}
                    className="w-20 h-10 border rounded"
                  />
                </div>
                {["hex", "rgb", "hsl", "name"].map((format) => (
                  <div key={format}>
                    <label className="block mb-2">{format.toUpperCase()}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData[format] || ""}
                        onChange={(e) => setFormData({ ...formData, [format]: e.target.value })}
                        placeholder={output?.placeholders[format] || `e.g. ${format === "name" ? "red" : format === "hex" ? "#ff0000" : format === "rgb" ? "rgb(255, 0, 0)" : "hsl(0, 100%, 50%)"}`}
                        className="flex-1 border p-2 rounded"
                      />
                      <button
                        onClick={() => handleCopy(formData[format] || "", format.toUpperCase())}
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        disabled={!formData[format] || output?.errors[format]}
                      >
                        Copy
                      </button>
                    </div>
                    {output?.errors[format] && (
                      <p className="text-red-600 text-sm mt-1">{output.errors[format]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <ToastContainer position="bottom-center" autoClose={1000} />
          </div>
        );
      }}
    />
  );
}