
import React, {useEffect, useState } from "react";
import { useDynamicToolLoader } from "../../hooks/useDynamicToolLoader"; // Hook tải hàm hash từ server

export default function UrlParser() {
    const [urlInput, setUrlInput] = useState("https://me:pwd@it-tools.tech:3000/url-parser?key1=value&key2=value2#the-hash");
    const [parsed, setParsed] = useState(null);
    const parserUrl = useDynamicToolLoader("url-parser", "parseUrl");

    // call parserUrl when urlInput changes
    useEffect(() => {
        if (parserUrl && urlInput) {
            try {
                const result = parserUrl(urlInput); // vì parseUrl không phải async
                setParsed(result);
            } catch (error) {
                setParsed({ error: error.message });
            }
        }
    }, [urlInput, parserUrl]);


    return (
        <div className="max-w-3xl mx-auto p-6 space-y-5">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">URL parser</h1>
            <p className="text-sm text-gray-600 mb-4">Parse a URL into its separate constituent parts...</p>

            <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                <input
                    type="text"
                    className="w-full border p-2 mb-4"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                />


                {parsed && !parsed.error && (
                    <div className="space-y-2">
                        {["protocol", "username", "password", "hostname", "port", "pathname", "search"].map(key => (
                            <div key={key} className="flex justify-between bg-gray-100 px-3 py-2 rounded">
                                <span>{key}</span>
                                <span className="text-gray-700">{parsed[key]}</span>
                            </div>
                        ))}

                        {parsed.searchParams && (
                            <div>
                                <p className="font-semibold mt-2">Params:</p>
                                {Object.entries(parsed.searchParams).map(([k, v]) => (
                                    <div key={k} className="flex justify-between bg-white px-3 py-1 border-b">
                                        <span>{k}</span>
                                        <span>{v}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {parsed?.error && <p className="text-red-600">{parsed.error}</p>}
            </div>
        </div>
    );
}
