import React from "react";
import ToolExecutor from "../../components/ToolExecutor"; // Đường dẫn tuỳ thuộc cấu trúc dự án của bạn
import { ToastContainer, toast } from "react-toastify"; // Thư viện thông báo

export default function UrlParser() {
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success("Copied to clipboard!");
        });
    };
    return (
        <ToolExecutor
            toolPath="url-parser"
            schemaInput={[
                {
                    type: "text",
                    name: "url",
                    label: "URL to parse",
                    placeholder: "https://me:pwd@it-tools.tech:3000/url-parser?key1=value&key2=value2#the-hash",
                    autoRun: true, // Tự động chạy khi có dữ liệu đầu vào
                }
            ]}
            customRenderer={({ formData, setFormData, output }) => (
                <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                    <input
                        type="text"
                        className="w-full border p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                        value={formData.url || ""}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://me:pwd@it-tools.tech:3000/url-parser?key1=value&key2=value2#the-hash"
                    />

                    {output && !output.error && (
                        <div className="space-y-2">
                            {["protocol", "username", "password", "hostname", "port", "pathname", "search"].map((key) => (
                                <div key={key} className="flex justify-between bg-gray-100 px-3 py-2 rounded">
                                    <span>{key}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-700">{output[key]}</span>
                                        <button
                                            onClick={() => handleCopy(output[key])}
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                                                <path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {output.searchParams && (
                                <div>
                                    <p className="font-semibold mt-2">Params:</p>
                                    {Object.entries(output.searchParams).map(([k, v]) => (
                                        <div key={k} className="flex justify-between bg-white px-3 py-1 border-b">
                                            <span>{k}</span>
                                            <div className="flex items-center gap-2">
                                                <span>{v}</span>
                                                <button
                                                    onClick={() => handleCopy(v)}
                                                    className="text-sm hover:text-gray-600"
                                                >
                                                    <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                                                        <path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {output?.error && <p className="text-red-600">{output.error}</p>}
                    <ToastContainer position="bottom-center" autoClose={1000} />
                </div>
            )}
        />
    );
}
