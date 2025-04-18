import ToolExecutor from '../../components/ToolExecutor';

export default function jsonMinify() {
    return (
        <ToolExecutor
            toolPath="json-minify"
            schemaInput={[{ autoRun: true }]}
            customRenderer={({ formData, setFormData, output }) => {
                return (
                    <div>
                        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                            <span className="text-sm text-gray-700 whitespace-nowrap">Your raw JSON</span>
                            <textarea
                                className={"w-full border border-gray-300 rounded-lg p-3 mb-6 resize-none h-80 focus:outline-none focus:ring-2 focus:ring-green-400"}
                                placeholder="Paste your JWT here..."
                                value={formData.json || ""}
                                onChange={(e) => setFormData({ ...formData, json: e.target.value })}
                            />
                        </div>

                        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                            <span className="text-sm text-gray-700 whitespace-nowrap">Your raw JSON</span>
                            <div className="relative">
                                <pre className="text-sm text-gray-700 overflow-auto">{output?.jsonMinify}</pre>
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(output?.jsonMinify || "");
                                    }}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    title="Copy to clipboard">
                                    <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                                        <path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }}
        />
    );

}
