import ToolExecutor from "../../components/ToolExecutor";
import NumberInputWithButtons from "../../components/ui/NumberInputWithButtons";

function getVietnamDateTimeLocal() {
    const now = new Date();
    const offsetInMs = 7 * 60 * 60 * 1000; // +7 giờ (GMT+7)
    const vietnamTime = new Date(now.getTime() + offsetInMs);
    return vietnamTime.toISOString().slice(0, 19);
}
export default function ETACalculator() {
    return (
        <ToolExecutor
            toolPath="eta-calculator"
            schemaInput={[{ autoRun: true }]}
            initialInput={{
                amountToConsume: 186,
                startTime: getVietnamDateTimeLocal(),
                amountPerSpan: 3,
                timeSpanValue: 5,
                unit: "minutes",
            }}
            customRenderer={({ formData, setFormData, output }) => {
                return (
                    <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <NumberInputWithButtons
                                label="Amount of element to consume"
                                value={formData.amountToConsume || 186}
                                min={1}
                                onChange={(val) => setFormData({ ...formData, amountToConsume: val })}
                            />

                            <div>
                                <label className="block font-medium mb-1">
                                    The consumption started at
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.startTime || new Date().toISOString().slice(0, 19)}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="col-span-2">
                                <NumberInputWithButtons
                                    label="Amount of unit consumed by time span"
                                    value={formData.amountPerSpan || 3}
                                    min={1}
                                    onChange={(val) => setFormData({ ...formData, amountPerSpan: val })}
                                />
                            </div>

                            <NumberInputWithButtons
                                label="in"
                                value={formData.timeSpanValue || 5}
                                min={1}
                                onChange={(val) => setFormData({ ...formData, timeSpanValue: val })}
                                className="col-span-1"
                            />

                            <div className="col-span-1">
                                <label className="font-medium mb-1">Unit</label>
                                <select
                                    value={formData.unit || "minutes"}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="seconds">seconds</option>
                                    <option value="minutes">minutes</option>
                                    <option value="hours">hours</option>
                                    <option value="days">days</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border">
                            <h3 className="text-gray-500 text-sm mb-1">Total duration</h3>
                            {output?.duration && (
                                <p className="text-xl">{output?.duration}</p>
                            )}
                        </div>

                        <div className="bg-white p-4 rounded-lg border">
                            <h3 className="text-gray-500 text-sm mb-1">It will end</h3>
                            {output?.endTime && (
                                <p className="text-xl">{output?.endTime}</p>
                            )}
                        </div>
                    </div>
                );
            }}
        />
    );
}
