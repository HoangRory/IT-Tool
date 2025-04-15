import React, { useState, useEffect, use } from 'react';
import { useDynamicToolLoader } from '../../hooks/useDynamicToolLoader'; // Hook to load the JWT parser function dynamically

export default function JwtParser() {
    const [jwt, setJwt] = useState('');
    const [invalidJwt, setInvalidJwt] = useState(false);
    const [header, setHeader] = useState({ alg: '', typ: '' });
    const [payload, setPayload] = useState({ sub: '', name: '', iat: '' });
    const JwtParser = useDynamicToolLoader('jwt-parser', 'jwtParser');

    useEffect(() => {
        if (!jwt) {
            setInvalidJwt(true); // Reset invalid JWT state if input is empty
            return;
        }
        if (jwt && JwtParser) {
            try {
                const result = JwtParser(jwt); // Call the loaded JWT parser function
                if (!result) {
                    setInvalidJwt(true); // Set invalid JWT state if result is null or undefined
                    return;
                }
                setInvalidJwt(false); // Reset invalid JWT state
                setHeader(result.header); // Update state with the header
                setPayload(result.payload); // Update state with the payload
            } catch (error) {
                console.error('Error decoding JWT:', error);
            }
        }
    }, [jwt, JwtParser]);

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-5">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">JWT parser</h1>
            <p className="text-sm text-gray-600 mb-4">
                Parse and decode your JSON Web Token (jwt) and display its content.
            </p>
            <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                <span className="text-sm text-gray-700 whitespace-nowrap">JWT to decode</span>
                <textarea
                    className={`w-full border border-gray-300 rounded-lg p-3 mb-6 resize-none h-28 focus:outline-none focus:ring-2 ${invalidJwt ? 'focus:ring-red-500' : 'focus:ring-green-400'
                        }`}
                    placeholder="Paste your JWT here..."
                    value={jwt}
                    onChange={(e) => setJwt(e.target.value)}
                />

                {invalidJwt && <p className="text-red-500">Invalid JWT format</p>}
                {!invalidJwt && jwt && (
                    <div className="bg-gray-50 border rounded-lg p-4">
                        {/* Header */}
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Header</h2>
                        <div className="grid grid-cols-3 gap-4 border-t border-b py-2 text-sm text-gray-700">
                            <div className="font-medium">alg (Algorithm)</div>
                            <div className="col-span-2">{header.alg}</div>
                            <div className="font-medium">typ (Type)</div>
                            <div className="col-span-2">{header.typ}</div>
                        </div>

                        {/* Payload */}
                        <h2 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Payload</h2>
                        <div className="grid grid-cols-3 gap-4 border-t border-b py-2 text-sm text-gray-700">
                            <div className="font-medium">sub (Subject)</div>
                            <div className="col-span-2">{payload.sub}</div>
                            <div className="font-medium">name (Full name)</div>
                            <div className="col-span-2">{payload.name}</div>
                            <div className="font-medium">iat (Issued At)</div>
                            <div className="col-span-2">
                                {payload.iat} ({payload.iat})
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
