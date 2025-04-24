import { Copy } from "lucide-react"; // Nếu bạn dùng Lucide icons hoặc FontAwesome...
import ToolExecutor from "../../components/ToolExecutor";
import NumberInputWithButtons from "../../components/ui/NumberInputWithButtons";
import Switch from "../../components/ui/Switch";
function normalizeSpaces(str) {
    return (str || "")
        .trim()              // Loại bỏ khoảng trắng đầu & cuối
        .replace(/\s+/g, " "); // Thay thế mọi chuỗi khoảng trắng liên tiếp bằng 1 dấu cách
}


const customRenderer = ({ formData, setFormData, output }) => {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
            <div className="relative ">
                <textarea
                    className={`w-full border rounded-md p-2 resize-none h-28 focus:ring-2 focus:ring-green-400 outline-none pr-5`}
                    placeholder="Enter string to obfuscate..."
                    value={formData.text || ""}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                />
                <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(output?.numeronyms || "")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 me-3"
                    title="Copy to clipboard"
                >
                    ✕
                </button>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
                <div>
                    <label className="block mb-1 text-sm">Keep first:</label>
                    <NumberInputWithButtons
                        value={formData.keepFirst || 4}
                        onChange={(value) => {
                            setFormData({ ...formData, keepFirst: value });
                        }}
                        min={0}
                        step={1}
                        className="w-10"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm">Keep last:</label>
                    <NumberInputWithButtons
                        value={formData.keepLast || 4}
                        onChange={(value) => {
                            setFormData({ ...formData, keepLast: value });
                        }}
                        min={0}
                        step={1}
                        className="w-10"
                    />
                </div>

                <div className="mb-4 ml-2">

                    <label className="block mb-1 text-sm">Keep Space:</label>

                    <Switch
                        checked={formData.keepSpaces || false}

                        onChange={(checked) => {
                            setFormData({ ...formData, keepSpaces: checked });
                        }}
                        className="mt-8"
                    />
                </div>
            </div>

            {output?.obfuscated && (
                <div className="relative">
                    <textarea
                        type="text"
                        className="w-full border rounded-md p-2 h-28 focus:ring-2 focus:ring-blue-400 outline-none pr-5"
                        readOnly
                        value={normalizeSpaces(output?.obfuscated) || ""}
                        placeholder="Your numeronym will be displayed here, e.g. 'i18n'"
                    />
                    <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(output?.obfuscated || "")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 me-2"
                        title="Copy to clipboard"
                    >
                        <Copy size={16} />
                    </button>
                </div>
            )}

        </div>
    );

}

export default function StringObfuscator() {
    return (
        <ToolExecutor
            toolPath="string-obfuscator"
            schemaInput={[
                {
                    autoRun: true, // Tự động parse khi có input
                }
            ]}
            customRenderer={customRenderer}
        />
    );
}