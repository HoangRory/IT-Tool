export const Button = ({ children, variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-700",
    secondary: "bg-gray-500 text-white hover:bg-gray-700",
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