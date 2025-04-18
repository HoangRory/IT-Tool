export const Button = ({ children, variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-green-500 text-white hover:bg-green-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    outline: "border border-gray-500 text-gray-500 hover:bg-gray-100",
  };

  return (
    <button
      className={`py-2 px-4 rounded ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}