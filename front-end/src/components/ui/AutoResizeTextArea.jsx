import React, { useRef } from "react";

export default function AutoResizingTextarea({ value, onChange, classNames, ...props }) {
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset để tính lại
      textarea.style.height = textarea.scrollHeight + "px"; // Đặt chiều cao theo nội dung
    }
    onChange(e);
  };

  return (
    <textarea
      ref={textareaRef}
      className={`${"border rounded-lg min-h-80 p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 overflow-hidden"} ${classNames}`}
      value={value}
      onChange={handleInput}
      rows={1}
      {...props}
    />
  );
}
