const Switch = ({ checked, onChange }) => {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 
          ${checked ? "bg-green-500" : "bg-gray-300"}`}
        >
            <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
            ${checked ? "translate-x-5" : "translate-x-0"}`}
            />
        </button>
    );
};

export default Switch;