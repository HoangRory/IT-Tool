import ToolExecutor from "../../components/ToolExecutor";
import NumberInputWithButtons from "../../components/ui/NumberInputWithButtons";

export default function PercentageCalculator() {
    return (
        <ToolExecutor
            toolName="Percentage Calculator"
            toolPath="percentage-calculator"
            description="Easily calculate percentages from a value to another value, or from a percentage to a value."
            schemaInput={[{ autoRun: true }]}
            customRenderer={({ formData, setFormData, output }) => {
                return (
                    <div className="space-y-6">
                        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                            <div className="flex gap-2 items-center">
                                <p className="whitespace-nowrap">What is</p>
                                <NumberInputWithButtons
                                    value={formData.percentValue || 0}
                                    min={0}
                                    onChange={(val) => setFormData({ ...formData, percentValue: val })}
                                    placeHolder="X"
                                />

                                <p className="whitespace-nowrap">% of</p>

                                <NumberInputWithButtons
                                    value={formData.percentBase || 0}
                                    min={0}
                                    onChange={(val) => setFormData({ ...formData, percentBase: val })}
                                    placeHolder="Y"
                                />

                                <div className="col-span-3 flex items-center border border-green-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
                                    <input
                                        type="text"
                                        value={
                                            isFinite(output?.percentOfResult)
                                                ? `${output.percentOfResult}`
                                                : ""
                                        }
                                        readOnly
                                        placeholder="result"
                                        className="w-full p-2 text-left focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        className="px-3 py-1 text-sm hover:bg-gray-100"
                                        onClick={() => {
                                            navigator.clipboard.writeText(isFinite(output?.percentOfResult)
                                                ? `${output.percentOfResult}`
                                                : "");
                                        }}
                                    >
                                        <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                                            <path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">

                            <div className="flex gap-2 items-center">
                                <NumberInputWithButtons
                                    value={formData.partValue || 0}
                                    min={0}
                                    onChange={(val) => setFormData({ ...formData, partValue: val })}
                                    placeHolder="X"
                                />
                                <p className="whitespace-nowrap">is what percent of</p>

                                <NumberInputWithButtons
                                    value={formData.wholeValue || 0}
                                    min={0}
                                    onChange={(val) => setFormData({ ...formData, wholeValue: val })}
                                    placeHolder="Y"
                                />

                                <div className="col-span-3 flex items-center border border-green-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
                                    <input
                                        type="text"
                                        value={
                                            isFinite(output?.whatPercentResult)
                                                ? `${output.whatPercentResult}`
                                                : ""
                                        }
                                        readOnly
                                        placeholder="result"
                                        className="w-full p-2 text-left focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        className="px-3 py-1 text-sm hover:bg-gray-100"
                                        onClick={() => {
                                            navigator.clipboard.writeText(isFinite(output?.percentOfResult)
                                                ? `${output.percentOfResult}`
                                                : "");
                                        }}
                                    >
                                        <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                                            <path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                            <p>What is the percentage increase/decrease</p>
                            <div className="flex gap-2 items-center">
                                <NumberInputWithButtons
                                    value={formData.fromValue || 0}
                                    onChange={(val) => setFormData({ ...formData, fromValue: val })}
                                    placeHolder="X"
                                />
                                <NumberInputWithButtons
                                    value={formData.toValue || 0}
                                    onChange={(val) => setFormData({ ...formData, toValue: val })}
                                    placeHolder="Y"
                                />



                                <div className="col-span-3 flex items-center border border-green-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
                                    <input
                                        type="text"
                                        value={
                                            isFinite(output?.changePercentResult)
                                                ? `${output.changePercentResult}` : ""
                                        }
                                        readOnly
                                        placeholder="result"
                                        className="w-full p-2 text-left focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        className="px-3 py-1 text-sm hover:bg-gray-100"
                                        onClick={() => {
                                            navigator.clipboard.writeText(isFinite(output?.percentOfResult)
                                                ? `${output.percentOfResult}`
                                                : "");
                                        }}
                                    >
                                        <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                                            <path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                );
            }}
        />
    );
}
