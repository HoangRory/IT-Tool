import React from "react";
import NumberInputWithButtons from "./ui/NumberInputWithButtons";
import AutoResizeTextArea from "./ui/AutoResizeTextArea";
import Switch from "./ui/Switch";


//chú thích các giá trị truyền vào hàm
//  * @param {string} type - Kiểu dữ liệu của trường (text, password, email, number, date, time, color, url, range, textarea, checkbox, select, radio, file, button).
//  * @param {string} label - Nhãn của trường (được hiển thị trên UI).
//  * @param {string} name - Tên của trường (được sử dụng làm id và name trong HTML).
//  * @param {any} value - Giá trị hiện tại của trường (được sử dụng để hiển thị giá trị trong UI).
//  * @param {function} onClick - Hàm được gọi khi người dùng nhấn vào nút (chỉ áp dụng cho trường kiểu button).
//  * @param {function} onChange - Hàm được gọi khi giá trị của trường thay đổi (được sử dụng để cập nhật giá trị trong state).
//  * @param {Array} options - Mảng các tùy chọn (chỉ áp dụng cho trường kiểu select và radio).
//  * @param {string} placeholder - Văn bản hiển thị khi trường trống (chỉ áp dụng cho các trường kiểu text, email, password, url, textarea).
//  * @param {object} rest - Các thuộc tính khác (được truyền vào cho trường) như className, readOnly, etc.

export default function DynamicField({ type, label, name, value, onClick, onChange, options = [], placeholder, classNameCustom, ...rest }) {
  const handleChange = (e) => {
    if (type === "checkbox")
      onChange(name, e.target.checked);
    else if (type === "file") {
      const files = e.target.files;
      onChange(name, rest.multiple ? files : files[0]);
    } else if(type === "range"){
      onChange(name, Number(e.target.value));
    } else if(type === "textarea"){
      onChange(name, e.target.value);
    } else if (type === "select") {
      onChange(name, e.target.value);
    } else if (type === "radio") {
      onChange(name, e.target.value);
    } else if (type === "button") {
      onClick && onClick(e);
    } else if (type === "number") {
      onChange(name, e);
    } else if (type === "switch") {
      onChange(name, e);
    } else
      onChange(name, e.target.value);
  };

  const commonProps = {
    name,
    id: name,
    value: type !== "file" ? value : undefined,
    placeholder: placeholder || "",
    onChange: handleChange,
    readOnly: rest.readOnly || false,
    ...rest
  };

  return (
    <div className="space-y-1 mb-4">
      {/* {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>} */}

      {(() => {
        switch (type) {
          case "span":
            return <span className={rest.className} >{label}</span>;
          case "text":
            return <input type="text" {...commonProps} />;
          case "password":
            return <input type="password" {...commonProps} />;
          case "email":
            return <input type="email" {...commonProps} />;
          case "number":
            return <NumberInputWithButtons value={value} label={label} onChange={onChange} {...commonProps} />;
          case "date":
            return <input type="date" {...commonProps} />;
          case "time":
            return <input type="time" {...commonProps} />;
          case "color":
            return <input type="color" {...commonProps} />;
          case "url":
            return <input type="url" {...commonProps} />;
          case "range":
            return <input
              type="range"
              min={rest.min || 1}
              max={rest.max || 512}
              step={rest.step || 1}
              value={value || 64}
              onChange={handleChange}
              className="w-full"
            />;

          case "textarea":
            return <AutoResizeTextArea value={value} onChange={handleChange} classNames={classNameCustom} placeholder={placeholder} />;
          case "checkbox":
            return (
              <label className="inline-flex items-center space-x-2">
                <input type="checkbox" checked={!!value || false} onChange={onChange} />
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
            return <input className={classNameCustom} type="file" {...commonProps} />;
          case "button":
            return <button className={classNameCustom} type="button" onClick={onClick}>
              {label}
            </button>
          case "switch":
            return <Switch checked={value} onChange={onChange} />;
          default:
            return <p className="text-red-500">Unsupported type: {type}</p>;
        }
      })()}
    </div>
  );
}
