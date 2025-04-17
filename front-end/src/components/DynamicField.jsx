import React from "react";

export default function DynamicField({ type, label, name, value, onChange, options = [], placeholder, ...rest }) {
  const handleChange = (e) => {
    if (type === "checkbox") {
      onChange(e.target.checked);
    } else if (type === "file") {
      onChange(e.target.files[0]);
    } else {
      onChange(e.target.value);
    }
  };

  const commonProps = {
    name,
    id: name,
    className: "w-full border p-2 rounded text-sm",
    value: type !== "file" ? value : undefined,
    placeholder,
    onChange: handleChange,
    ...rest
  };

  return (
    <div className="space-y-1 mb-4">
      {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>}

      {(() => {
        switch (type) {
          case "text":
          case "password":
          case "email":
          case "number":
          case "date":
          case "time":
          case "color":
          case "url":
          case "range":
            return <input type={type} {...commonProps} />;
          case "textarea":
            return <textarea rows={4} {...commonProps} />;
          case "checkbox":
            return (
              <label className="inline-flex items-center space-x-2">
                <input type="checkbox" checked={!!value} onChange={handleChange} />
                <span>{label}</span>
              </label>
            );
          case "select":
            return (
              <select {...commonProps}>
                {options.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            );
          case "radio":
            return (
              <div className="flex flex-col space-y-1">
                {options.map((opt, idx) => (
                  <label key={idx} className="inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      name={name}
                      value={opt.value}
                      checked={value === opt.value}
                      onChange={handleChange}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            );
          case "file":
            return <input type="file" {...commonProps} />;
          case "button":
            return (
              <button type="button" onClick={rest.onClick} className="bg-blue-500 text-white px-4 py-2 rounded">
                {label}
              </button>
            );
          default:
            return <p className="text-red-500">Unsupported type: {type}</p>;
        }
      })()}
    </div>
  );
}
