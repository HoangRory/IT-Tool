import React, { useState, useEffect } from "react";
import { useDynamicToolLoader } from "../../hooks/useDynamicToolLoader";

export default function TokenGenerator() {
    const [uppercase, setUppercase] = useState(false);
    const [lowercase, setLowercase] = useState(false);
    const [numbers, setNumbers] = useState(false);
    const [symbols, setSymbols] = useState(false);
    const [length, setLength] = useState(16);
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);

    const generateToken = useDynamicToolLoader("token-generator", "generateToken");

    // Debounce function
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    // Generate token when inputs change
    useEffect(() => {
        if (generateToken) {
            const debouncedGenerate = debounce(() => {
                try {
                    const result = generateToken(uppercase, lowercase, numbers, symbols, length);
                    setError(result.error || null);
                    setToken(result.token || null);
                } catch (err) {
                    setError("An error occurred while generating the token.");
                    setToken(null);
                }
            }, 300);
            debouncedGenerate();
        }
    }, [uppercase, lowercase, numbers, symbols, length, generateToken]);

    // Handle copy to clipboard
    const handleCopy = () => {
        if (token) {
            navigator.clipboard.writeText(token);
            alert("Token copied to clipboard!");
        }
    };

    // Handle refresh
    const handleRefresh = () => {
        if (generateToken) {
            try {
                const result = generateToken(uppercase, lowercase, numbers, symbols, length);
                setError(result.error || null);
                setToken(result.token || null);
            } catch (err) {
                setError("An error occurred while generating the token.");
                setToken(null);
            }
        }
    };

    return (
        <div className="flex justify-center bg-gray-100 min-h-screen pt-8">
            <div className="w-full max-w-md p-6">
                <h2 className="text-3xl font-bold text-center text-gray-800">Token Generator</h2>
                <p className="text-sm text-center text-gray-600 mt-2">
                    Generate random string with the chars you want, uppercase or lowercase letters, numbers and/or symbols.
                </p>
                <form className="mt-6 p-6 border border-gray-300 rounded-lg shadow-md bg-white">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="uppercase"
                                checked={uppercase}
                                onChange={(e) => setUppercase(e.target.checked)}
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
                                checked={lowercase}
                                onChange={(e) => setLowercase(e.target.checked)}
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
                                checked={numbers}
                                onChange={(e) => setNumbers(e.target.checked)}
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
                                checked={symbols}
                                onChange={(e) => setSymbols(e.target.checked)}
                                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="symbols" className="text-gray-700 font-medium">
                                Symbols (!-...)
                            </label>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="length" className="block text-gray-700 font-medium mb-2">
                            Length: {length}
                        </label>
                        <input
                            type="range"
                            id="length"
                            min="1"
                            max="512"
                            value={length}
                            onChange={(e) => setLength(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {error && <p className="mb-4 text-center text-red-600">{error}</p>}
                    {token && (
                        <div className="mb-6">
                            <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
                                <p className="text-gray-800 break-all">{token}</p>
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
                </form>
            </div>
        </div>
    );
}