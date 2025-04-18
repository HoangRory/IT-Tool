import ToolExecutor from "../../components/ToolExecutor";
import { toast, ToastContainer } from "react-toastify";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useEffect, useState } from "react";

export default function BcryptTool() {
  const [result, setResult] = useState(
    {
      hash: "",
      match: false,
    }
  );
  return (
    <ToolExecutor
      toolName="Bcrypt"
      toolPath="bcrypt"
      description="Hash and compare text string using bcrypt. Bcrypt is a password-hashing function based on the Blowfish cipher."
      schemaInput={[
        {autoRun: true },
      ]}
      customRenderer={({ formData, setFormData, output }) => {
        useEffect(() => {
          if (output?.hash) {
            setResult((prev) => ({ ...prev, hash: output.hash }));
          }
          if (output?.match !== undefined) {
            setResult((prev) => ({ ...prev, match: output.match }));
          }
        }, [output]);
        return (
            <div>
              <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                <h2 className="text-2xl font-semibold mb-2">Hash</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 whitespace-nowrap">Your string:</span>
                  <Input
                    value={formData.input || ""}
                    onChange={(e) => setFormData({ ...formData, input: e.target.value, mode: "hash" })}
                    type="text"
                    placeholder="Your string to hash..."
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 whitespace-nowrap">Salt count:</span>
                  <Input
                    type="number"
                    value={formData.saltRounds || 10}
                    onChange={(e) => setFormData({ ...formData, saltRounds: Number(e.target.value), mode: "hash" })}
                    min={1}
                    max={20}
                  />
                </div>

                <div className="space-y-4">
                  <Input value={result.hash || ""}
                    onChange={(e) => setResult({ ...result, hash: e.target.value })}
                    readOnly />
                  <Button
                    variant="primary"
                    //onclick là copy vào clipboard
                    onClick={() => {
                      navigator.clipboard.writeText(result.hash).then(() => {
                        toast.success("Copied to clipboard!");
                      });
                    }}
                  >
                    Copy hash
                  </Button>
                  <ToastContainer position="bottom-center" autoClose={1000} />
                </div>
              </div>
            
              <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                <h2 className="text-2xl font-semibold mb-2">Compare</h2>
                <Input
                  placeholder="Your string to compare..."
                  value={formData.inputCompare || ""}
                  onChange={(e) => setFormData({ ...formData, inputCompare: e.target.value, mode: "compare" })}
                />
                <Input
                  placeholder="Your hash to compare..."
                  value={formData.hash || ""}
                  onChange={(e) => setFormData({ ...formData, hash: e.target.value, mode: "compare" })}
                />
                {result.match !== null && (
                  <p className="text-sm font-semibold">
                    Do they match?{' '}
                    <span className={result.match ? "text-green-600" : "text-red-600"}>
                      {result.match ? "Yes" : "No"}
                    </span>
                  </p>
                )}
              </div>
            </div>
        )
      }}
    />

  )
}