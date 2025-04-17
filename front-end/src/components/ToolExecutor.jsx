import React, { useEffect, useState } from "react";
import { useDynamicToolLoader } from "../hooks/useDynamicToolLoader";
import DynamicField from "./DynamicField"; // Import component render input theo type

/**
 * Component `ToolExecutor`
 * Dùng để render một tool (công cụ) được nạp động và chạy tool đó dựa trên schema input/output.
 *
 * @param {string} toolName - Tên tool (dùng để load file JS tương ứng từ backend).
 * @param {Array} schemaInput - Mảng schema mô tả các input field cần hiển thị (dạng: { name, label, type, autoRun, action }).
 * @param {Array} schemaOutput - Mảng tên các field sẽ hiển thị trong phần output (dạng: ['result', 'status']).
 * @param {function} customRenderer - (Tùy chọn) Nếu truyền vào hàm custom renderer, sẽ override toàn bộ UI mặc định của tool executor.
 */

export default function ToolExecutor({ toolName, schemaInput = [], schemaOutput = [], customRenderer }) {
  const [formData, setFormData] = useState({});
  const [output, setOutput] = useState(null);
  const runTool = useDynamicToolLoader(toolName, "run");

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleRun = async () => {
    if (runTool) {
      try {
        console.log("Running tool with data:",formData);

        const result = await runTool(formData);
        console.log("Output:", typeof(result), result);
        setOutput(result);
      } catch (error) {
        setOutput({ error: error.message });
      }
    }
  };

  useEffect(() => {
    if (schemaInput.length > 0 && schemaInput[0].autoRun && runTool) {
      handleRun();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, runTool]);

  // Nếu người dùng truyền custom renderer → dùng giao diện của họ
  if (customRenderer) {
    return customRenderer({ formData, setFormData, output, runTool });
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">{toolName}</h1>

      {/* Render các input */}
      {schemaInput.map((field, idx) => (
        <DynamicField
          key={idx}
          {...field}
          value={formData[field.name]}
          onChange={(val) => handleChange(field.name, val)}
          onClick={field.action === "run" ? handleRun : undefined}
        />
      ))}

      {/* Kết quả */}
      {output && (
        <div className="bg-gray-100 p-4 rounded mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Output:</h3>
          {schemaOutput.length > 0 ? (
            <ul className="space-y-1">
              {schemaOutput.map((key, idx) => (
                <li key={idx}>
                  <strong>{key}:</strong> {JSON.stringify(output[key])}
                </li>
              ))}
            </ul>
          ) : (
            <pre>{JSON.stringify(output, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
