
import React, {useEffect, useState } from "react";
import { useURLParserLoader } from "../../hooks/useURLParserLoader";

export default function UrlParser() {
    const [urlInput, setUrlInput] = useState("https://me:pwd@it-tools.tech:3000/url-parser?key1=value&key2=value2#the-hash");
    const [parsed, setParsed] = useState(null);
    const parserFn = useURLParserLoader(); // custom hook to load the parser function
   
    // call parserFn when urlInput changes
    useEffect(() => {
        if (parserFn && urlInput) {
            try {
                const result = parserFn(urlInput); // vì parseUrl không phải async
                setParsed(result);
            } catch (error) {
                setParsed({ error: error.message });
            }
        }
    }, [urlInput, parserFn]);


    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2">URL parser</h1>
            <p className="mb-4 text-gray-500">Parse a URL into its separate constituent parts...</p>

            <input
                type="text"
                className="w-full border px-3 py-2 mb-4"
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
    );
}
