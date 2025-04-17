import ToolExecutor from "../../components/ToolExecutor";
import {toast, ToastContainer} from "react-toastify";

export default function TokenGenerator() {
  return (
    <ToolExecutor
      toolName="token-generator"
      schemaInput={[
        { autoRun: true }
      ]}
      customRenderer={({ formData, setFormData, output }) => {
        // Handle copy to clipboard
        const handleCopy = () => {
          if (output?.token) {
            const token = output.token;
            navigator.clipboard.writeText(token).then(() => {
              toast.success("Copied to clipboard!");
            });
          }
        };
        const handleRefresh = () => {
          setFormData({ ...formData, token: null });
        };
        return (
          <div className="flex justify-center bg-gray-100 min-h-screen pt-8">
            <div className="w-full max-w-md p-6">
              <h2 className="text-3xl font-bold text-center text-gray-800">Token Generator</h2>
              <p className="text-sm text-center text-gray-600 mt-2">
                Generate random string with the chars you want, uppercase or lowercase letters, numbers and/or symbols.
              </p>
              <div
                className="mt-6 p-6 border border-gray-300 rounded-lg shadow-md bg-white"
              >
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="uppercase"
                      checked={formData.uppercase || false}
                      onChange={(e) => setFormData({ ...formData, uppercase: e.target.checked })}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="uppercase" className="text-gray-700 font-medium">
                      Uppercase (ABC...)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="lowercase"
                      checked={formData.lowercase || false}
                      onChange={(e) => setFormData({ ...formData, lowercase: e.target.checked })}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="lowercase" className="text-gray-700 font-medium">
                      Lowercase (abc...)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="numbers"
                      checked={formData.numbers || false}
                      onChange={(e) => setFormData({ ...formData, numbers: e.target.checked })}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="numbers" className="text-gray-700 font-medium">
                      Numbers (123...)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="symbols"
                      checked={formData.symbols || false}
                      onChange={(e) => setFormData({ ...formData, symbols: e.target.checked })}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="symbols" className="text-gray-700 font-medium">
                      Symbols (!-...)
                    </label>
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="length" className="block text-gray-700 font-medium mb-2">
                    Length: {formData.length || 1}
                  </label>
                  <input
                    type="range"
                    id="length"
                    min="1"
                    max="512"
                    value={formData.length || 1}
                    onChange={(e) => setFormData({ ...formData, length: parseInt(e.target.value, 10) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Token Display Inside Form */}
                {/* {output?.error && <p className="mb-4 text-center text-red-600">{output?.error}</p>} */}
                {output?.token && (
                  <div className="mb-6">
                    <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
                      <p className="text-gray-800 break-all">{output?.token}</p>
                    </div>
                    <div className="mt-4 flex justify-center gap-4">
                      <button
                        onClick={handleCopy}
                        type="button"
                        className="px-4 py-2 bg-black text-white font-semibold rounded-md shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                      >
                        Copy
                      </button>
                      <button
                        onClick={handleRefresh}
                        type="button"
                        className="px-4 py-2 bg-black text-white font-semibold rounded-md shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                      >
                        Refresh
                      </button>
                    </div>
                  </div>
                )}
                <ToastContainer position="bottom-center" autoClose={1000} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}