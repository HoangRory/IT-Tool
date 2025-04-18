import ToolExecutor from "../../components/ToolExecutor";
import { Copy } from "lucide-react"; // Nếu bạn dùng Lucide icons hoặc FontAwesome...

const customRenderer = ({ formData, setFormData, output }) => {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
            <div className="relative">
                <input
                    type="text"
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={formData.text || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, text: e.target.value })
                    }
                    placeholder="Enter a word, e.g. 'internationalization'"
                />
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, text: "" })} 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Clear"
                >
                    ✕
                </button>
            </div>

            <div className="relative">
                <input
                    type="text"
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    readOnly
                    value={output?.numeronyms || ""}
                    placeholder="Your numeronym will be displayed here, e.g. 'i18n'"
                />
                <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(output?.numeronyms || "")} 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Copy to clipboard"
                >
                    <Copy size={16} />
                </button>
            </div>
        </div>
    );
}

export default function NumeronymGenerator() {
    return (
        <ToolExecutor
            toolPath="numeronym-generator"
            schemaInput={[{
                autoRun: true,
            }]}
            customRenderer={customRenderer}
        />
    );
}
