import React from 'react';
import ToolExecutor from '../../components/ToolExecutor';
function formatUnixTimestamp(unix) {
    if (!unix || isNaN(unix)) return 'Invalid time';
    const date = new Date(unix * 1000); // JWT iat is in seconds
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
}

export default function JwtParser() {

    return (
        <ToolExecutor
            toolName="JWT Parser"
            toolPath="jwt-parser"
            description="Decode and parse JWT (JSON Web Token) to view its header and payload."
            schemaInput={[
                {
                    type: "textarea",
                    name: "jwt",
                    label: "JWT to decode",
                    placeholder: "Paste your JWT here...",
                    autoRun: true, // Tự động parse khi có input
                }
            ]}
            customRenderer={({ formData, setFormData, output }) => {
                const jwt = formData.jwt || "";
                const invalidJwt = jwt && output.error && output.error.message === "Invalid JWT format";
                return (
                    <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                        <span className="text-sm text-gray-700 whitespace-nowrap">JWT to decode</span>
                        <textarea
                            className={`w-full border border-gray-300 rounded-lg p-3 mb-6 resize-none h-28 focus:outline-none focus:ring-2 ${invalidJwt ? 'focus:ring-red-500' : 'focus:ring-green-400'
                                }`}
                            placeholder="Paste your JWT here..."
                            value={jwt}
                            onChange={(e) => setFormData({ ...formData, jwt: e.target.value })}
                        />

                        {invalidJwt && <p className="text-red-500">Invalid JWT format</p>}
                        {!invalidJwt && jwt && (
                            <div className="bg-gray-50 border rounded-lg p-4">
                                {/* Header */}
                                <h2 className="text-lg font-semibold text-gray-700 mb-2">Header</h2>
                                <div className="grid grid-cols-3 gap-4 border-t border-b py-2 text-sm text-gray-700">
                                    <div className="font-medium">alg (Algorithm)</div>
                                    <div className="col-span-2">{output.header?.alg}</div>
                                    <div className="font-medium">typ (Type)</div>
                                    <div className="col-span-2">{output.header?.typ}</div>
                                </div>

                                {/* Payload */}
                                <h2 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Payload</h2>
                                <div className="grid grid-cols-3 gap-4 border-t border-b py-2 text-sm text-gray-700">
                                    <div className="font-medium">sub (Subject)</div>
                                    <div className="col-span-2">{output.payload?.sub}</div>
                                    <div className="font-medium">name (Full name)</div>
                                    <div className="col-span-2">{output.payload?.name}</div>
                                    <div className="font-medium">iat (Issued At)</div>
                                    <div className="col-span-2">
                                        {output.payload?.iat} {formatUnixTimestamp(output.payload?.iat)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }}
        />
    );
}
