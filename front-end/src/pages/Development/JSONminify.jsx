import React, { useState, useEffect, use } from 'react';
import { useDynamicToolLoader } from '../../hooks/useDynamicToolLoader'; // Hook to load the JWT parser function dynamically

export default function jsonMinify() {
    const [json, setJson] = useState(''); // State to hold the input JSON string
    const [jsonMinifyResult, setJsonMinifyResult] = useState(''); // State to hold the minified JSON result
    const jsonMinify = useDynamicToolLoader('json-minify', 'minifyJson');

    useEffect(() => {
        if (jsonMinify && json) {
            try {
                const result = jsonMinify(json); // Call the JWT parser function with the input JSON
                setJsonMinifyResult(result); // Update the minified JSON result state
            } catch (error) {
                setJsonMinifyResult('Error: ' + error.message); // Handle any errors that occur during parsing
            }
        } else {
            setJsonMinifyResult(''); // Reset the minified JSON result if input is empty
        }
    }
    , [json, jsonMinify]); // Re-run effect when json or jsonMinify changes

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonMinifyResult); // Copy the minified JSON to clipboard
    }
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-5">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">JSON minify</h1>
            <p className="text-sm text-gray-600 mb-4">
                Minify and compress your JSON by removing unnecessary whitespace.
            </p>
            <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                <span className="text-sm text-gray-700 whitespace-nowrap">Your raw JSON</span>
                <textarea
                    className={"w-full border border-gray-300 rounded-lg p-3 mb-6 resize-none h-80 focus:outline-none focus:ring-2 focus:ring-green-400"}
                    placeholder="Paste your JWT here..."
                    value={json}    
                    onChange={(e) => setJson(e.target.value)}
                />
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                <span className="text-sm text-gray-700 whitespace-nowrap">Your raw JSON</span>
                <div className="relative">
                    <pre className="text-sm text-gray-700 overflow-auto">{jsonMinifyResult}</pre>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        title="Copy to clipboard">
                    </button>
                </div>
            </div>
        </div>
    );
}
