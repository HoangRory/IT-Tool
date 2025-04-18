import ToolExecutor from "../../components/ToolExecutor";
import AutoResizingTextarea from "../../components/ui/AutoResizeTextArea";
export default function MathEvaluator() {
    return (
        <ToolExecutor
            toolPath="math-evaluator"
            toolDescription="A calculator for evaluating mathematical expressions. You can use functions like sqrt, cos, sin, abs, etc."
            toolName="Math Evaluator"
            schemaInput={[
                { autoRun: true },
            ]}
            customRenderer={({ formData, setFormData, output }) => {
                return (
                    <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                        <AutoResizingTextarea
                            value={formData.expression || ""}
                            onChange={(e) => setFormData({ ...formData, expression: e.target.value })}
                            placeholder="Your math expression (ex 2*sqrt(6))..."
                        />
                        {output?.result && !output?.error && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Result:</h3>
                                <p>{output.result.toString()}</p>
                            </div>
                        )}

                    </div>
                );
            }}
        />
    );
}