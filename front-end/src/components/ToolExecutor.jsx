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

  function collectActions(schema) {
    if (!Array.isArray(schema)) return [];

    return schema.flatMap(field => [
      ...(field.action ? [field.action] : []),
      ...(field.children ? collectActions(field.children) : [])
    ]);
  }

  const actionNames = Array.from(
    new Set([...collectActions(schemaInput), ...collectActions(schemaOutput), "run"])
  );

  // Load các hàm cần thiết
  const { exports, error } = useDynamicToolLoader(toolPath, actionNames);
  const runTool = exports?.run;

  // Tìm tool tương ứng với toolPath
  const matchedTool = tools.flatMap(category => category.items).find(tool => tool.path === toolPath);
  const toolName = matchedTool?.name || "Tool Executor";
  const description = matchedTool?.description || "No description provided.";
  const toolId = matchedTool?.id;

  const isFavorite = toolId ? favoriteToolIds.includes(toolId) : false;

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleRun = async () => {
    if (runTool) {
      try {
        console.log("Running tool with formData:", formData);
        const result = await runTool(formData);
        console.log("Tool result:", result);
        setOutput(result);
      } catch (error) {
        setOutput({ error: error.message });
      }
    }
  };

  useEffect(() => {
    if (schemaInput.length > 0 && runTool) {
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
  

  const renderField = (field, key) => {
    if (field.type === "div" && Array.isArray(field.children)) {
      return (
        <div key={key} className={field.className}>
          {field.children.map((child, idx) => renderField({...child, _source: field._source}, `${key}-${idx}`))}
        </div>
      );
    }

    const isOutput = field._source === "output";

    return (
      <DynamicField
        key={key}
        {...field}
        value={
          isOutput
            ? output?.[field.name] ?? field.value ?? ""
            : formData[field.name] ?? field.value ?? ""
        }
        classNameCustom={field.className || ""}
        onChange={
          isOutput
            ? undefined
            : (fieldName, val) => handleChange(fieldName, val)
        }
        onClick={
          field.action && exports?.[field.action]
            ? () =>
              isOutput
                ? exports[field.action](output?.[field.name])
                : exports[field.action](formData)
            : undefined
        }
      />
    );
  };


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
          {schemaInput.map((field, idx) =>
            renderField({ ...field, _source: "input" }, idx)
          )}
          {schemaOutput.map((field, idx) =>
            renderField({ ...field, _source: "output" }, idx + schemaInput.length)
          )}

        </div>
      </div>
    </div>
  );
}