import ToolExecutor from "../../components/ToolExecutor";

const ViewResult = ({ characters = 0, words = 0, lines = 0, bytes = "0 Bytes" }) => {
    const items = [
        { label: "Character count", value: characters },
        { label: "Word count", value: words },
        { label: "Line count", value: lines },
        { label: "Byte size", value: bytes },
    ];

    return (
        <div className="flex justify-between w-full max-w-xl mx-auto mt-4">
            {items.map((item, index) => (
                <div key={index} className="text-center px-4">
                    <div className="text-sm text-gray-600">{item.label}</div>
                    <div className="text-xl font-semibold">{item.value}</div>
                </div>
            ))}
        </div>
    );
}

const customRenderer = ({ formData, setFormData, output }) => {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
            <textarea
                className={`w-full border border-gray-300 rounded-lg p-3 mb-6 resize-none h-28 focus:outline-none focus:ring-2 focus:ring-green-400`}
                placeholder="Your text..."
                value={formData.text || ""}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            />
            {/* tạo phần tử div hiển thị theo chiều ngang có khoảng hiển thị bằng nhau */}
            <ViewResult
                characters={output?.characters || 0}
                words={output?.words || 0}
                lines={output?.lines || 0}
                bytes={output?.bytes || 0}
            />
        </div>
    );
}

export default function TextStatistics() {
    return (
        <ToolExecutor
            toolPath="text-statistics"
            schemaInput={[
                {
                    type: "textarea",
                    name: "text",
                    label: "Your text",
                    placeholder: "Paste your text here...",
                    autoRun: true, // Tự động parse khi có input
                }
            ]}
            customRenderer={customRenderer}
        />
    );
}