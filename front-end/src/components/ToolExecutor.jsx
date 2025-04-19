import React, { useEffect, useState, useContext } from "react";
import { useDynamicToolLoader } from "../hooks/useDynamicToolLoader";
import DynamicField from "./DynamicField";
import { ToolsContext } from "../context/ToolsContext";
import PremiumRequiredModal from "./PremiumRequiredModal";
import FavoriteButton from "./ui/FavoriteButton";

/**
 * Component `ToolExecutor`
 * Dùng để render một tool (công cụ) được nạp động và chạy tool đó dựa trên schema input/output.
 *
 * @param {string} toolName - Tên tool được hiển thị trên UI.
 * @param {string} toolPath - Đường dẫn tới tool (được nạp động).
 * @param {string} description - Mô tả tool (được hiển thị trên UI).
 * @param {Array} schemaInput - Mảng schema mô tả các input field cần hiển thị (dạng: { name, label, type, autoRun, action }).
 * @param {Array} schemaOutput - Mảng tên các field sẽ hiển thị trong phần output (dạng: ['result', 'status']).
 * @param {function} customRenderer - (Tùy chọn) Nếu truyền vào hàm custom renderer, sẽ override toàn bộ UI mặc định của tool executor.
 */

export default function ToolExecutor({ toolPath, initialInput, schemaInput = [], schemaOutput = [], customRenderer }) {
  const [formData, setFormData] = useState(initialInput || {});
  const [output, setOutput] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { tools, favoriteToolIds, toggleFavorite, isLoading } = useContext(ToolsContext);
  const { toolFn: runTool, error } = useDynamicToolLoader(toolPath, "run");

  // Debug: Log tools and toolPath to verify data
  console.log("ToolsContext tools:", tools);
  console.log("ToolExecutor toolPath:", toolPath);

  const matchedTool = tools.flatMap(category => category.items).find(tool => tool.path === toolPath);
  const toolName = matchedTool?.name || "Tool Executor";
  const description = matchedTool?.description || "No description provided.";
  const toolId = matchedTool?.id;

  // Debug: Log matchedTool and toolId
  console.log("Matched Tool:", matchedTool);
  console.log("Tool ID:", toolId);

  const isFavorite = toolId ? favoriteToolIds.includes(toolId) : false;

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleRun = async () => {
    if (runTool) {
      try {
        const result = await runTool(formData);
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
  }, [formData, runTool]);

  useEffect(() => {
    if (error && error.includes("Forbid")) {
      setShowUpgradeModal(true);
    }
  }, [error]);

  // Nếu truyền custom renderer → dùng giao diện của họ
  if (customRenderer) {
    return (
      <div className="max-w-3xl min-h-screen mx-auto p-6 space-y-5">
        {showUpgradeModal && (
          <PremiumRequiredModal
            onClose={() => {
              setShowUpgradeModal(false);
              window.location.href = "/";
            }}
          />
        )}
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">{toolName}</h1>
          {toolId && (
            <FavoriteButton
              toolId={toolId}
              toolPath={toolPath}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
            />
          )}
        </div>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        {customRenderer({ formData, setFormData, output, runTool })}
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen pt-85">
      {showUpgradeModal && (
        <PremiumRequiredModal
          onClose={() => {
            setShowUpgradeModal(false);
            window.location.href = "/";
          }}
        />
      )}
      <div className="w-full max-w-3xl p-6 space-y-5">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">{toolName}</h1>
          {toolId && (
            <FavoriteButton
              toolId={toolId}
              toolPath={toolPath}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
            />
          )}
        </div>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
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
      </div>
    </div>
  );
}