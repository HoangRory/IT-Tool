import React, { useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { ToastContainer, toast } from "react-toastify";
export default function RandomPortGenerator() {
    const [port, setPort] = useState(generateRandomPort());
    function generateRandomPort() {
        return Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;
    }
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-5">
            <h2 className="text-3xl font-bold text-center text-gray-800">Random Port Generator</h2>
            <p className="text-sm text-center text-gray-600 mt-2">
                Generate random port numbers outside of the range of "known" ports (0-1023).
            </p>
            <div className="bg-white shadow-md rounded-xl p-6 space-y-4 mt-4">
                <div className="flex items-center justify-center mb-2">
                    <Input
                        type="text"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        placeholder="Generated port number"
                        readOnly
                        className="text-center border-none focus:outline-none focus:ring-0 bg-transparent"
                    />
                </div>

                <div className="flex justify-center space-x-4 mt-4">
                    <Button
                        variant="primary"
                        //onclick là copy vào clipboard
                        onClick={() => {
                            navigator.clipboard.writeText(port).then(() => {
                                toast.success("Copied to clipboard!");
                            });
                        }}
                    >
                        Copy
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            const randomPort = generateRandomPort();
                            setPort(randomPort);
                        }}
                    >
                        Refresh
                    </Button>
                </div>
                <ToastContainer position="bottom-center" autoClose={1000} />

            </div>
        </div>

    );
}