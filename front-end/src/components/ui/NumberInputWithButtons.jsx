import React from "react";

const NumberInputWithButtons = ({
  label,
  value,
  min = Number.NEGATIVE_INFINITY,
  onChange,
  step = 1,
}) => {
  const handleDecrease = () => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
  };

  const handleIncrease = () => {
    onChange(value + step);
  };

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(newValue);
    } else {
      onChange(min);
    }
  };

  return (
    <div >
      {label && <label className="block font-medium mb-1">{label}</label>}
      <div className="flex items-center border border-green-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
        <input
          type="type"
          value={value}
          onChange={handleInputChange}
          min={min}
          className="w-full p-2 text-left focus:outline-none"
        />
          <button
            type="button"
            className="px-3 py-1 text-sm hover:bg-gray-100"
            onClick={handleDecrease}
          >
            −
          </button>
          <button
            type="button"
            className="px-3 py-1 text-sm hover:bg-gray-100"
            onClick={handleIncrease}
          >
            +
          </button>
      </div>
    </div>
  );
};

export default NumberInputWithButtons;
