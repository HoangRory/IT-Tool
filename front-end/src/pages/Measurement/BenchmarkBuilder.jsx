import React, { useEffect } from "react";
import ToolExecutor from "../../components/ToolExecutor";
import { ToastContainer, toast } from "react-toastify";
import useLocalStorage from "use-local-storage";

export default function BenchmarkBuilder() {
  const [suites, setSuites] = useLocalStorage("benchmark-builder:suites", [
    { title: "Suite 1", data: [5, 10] },
    { title: "Suite 2", data: [8, 12] },
  ]);
  const [unit, setUnit] = useLocalStorage("benchmark-builder:unit", "");

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  const updateSuite = (index, field, value) => {
    const newSuites = [...suites];
    newSuites[index][field] = value;
    setSuites(newSuites);
  };

  const addSuite = () => {
    setSuites([...suites, { title: `Suite ${suites.length + 1}`, data: [0] }]);
  };

  const deleteSuite = (index) => {
    if (suites.length > 1) {
      const newSuites = [...suites];
      newSuites.splice(index, 1);
      setSuites(newSuites);
    }
  };

  const addMeasurement = (suiteIndex) => {
    const newSuites = [...suites];
    newSuites[suiteIndex].data.push(null);
    setSuites(newSuites);
  };

  const updateMeasurement = (suiteIndex, measureIndex, value) => {
    const newSuites = [...suites];
    newSuites[suiteIndex].data[measureIndex] = value ? Number(value) : null;
    setSuites(newSuites);
  };

  const deleteMeasurement = (suiteIndex, measureIndex) => {
    const newSuites = [...suites];
    newSuites[suiteIndex].data.splice(measureIndex, 1);
    setSuites(newSuites);
  };

  const resetSuites = () => {
    setSuites([
      { title: "Suite 1", data: [] },
      { title: "Suite 2", data: [] },
    ]);
    setUnit("");
  };

  return (
    <ToolExecutor
      toolPath="benchmark-builder"
      initialInput={{ suites, unit }}
      schemaInput={[
        {
          type: "text",
          name: "unit",
          label: "Unit",
          placeholder: "Unit (e.g., ms)",
          value: unit,
          autoRun: true,
        },
      ]}
      customRenderer={({ formData, setFormData, output }) => {
        // Sync formData.unit with local storage unit
        useEffect(() => {
          if (formData.unit !== unit) {
            setUnit(formData.unit || "");
          }
        }, [formData.unit]);

        return (
          <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap gap-4 justify-center">
              {suites.map((suite, suiteIndex) => (
                <div key={suiteIndex} className="w-72 border rounded p-4">
                  <input
                    type="text"
                    className="w-full border p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                    value={suite.title}
                    onChange={(e) => updateSuite(suiteIndex, "title", e.target.value)}
                    placeholder="Suite name..."
                  />
                  <div className="space-y-2">
                    {suite.data.map((value, measureIndex) => (
                      <div key={measureIndex} className="flex gap-2">
                        <input
                          type="number"
                          className="w-full border p-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                          value={value ?? ""}
                          onChange={(e) => updateMeasurement(suiteIndex, measureIndex, e.target.value)}
                          placeholder="Set your measure..."
                        />
                        <button
                          onClick={() => deleteMeasurement(suiteIndex, measureIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                            <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addMeasurement(suiteIndex)}
                      className="w-full text-sm text-blue-600 hover:underline flex items-center"
                    >
                      <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="mr-2">
                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                      Add a measure
                    </button>
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    {suites.length > 1 && (
                      <button
                        onClick={() => deleteSuite(suiteIndex)}
                        className="text-sm text-red-600 hover:underline flex items-center"
                      >
                        <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="mr-2">
                          <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                        Delete suite
                      </button>
                    )}
                    <button
                      onClick={addSuite}
                      className="text-sm text-blue-600 hover:underline flex items-center"
                    >
                      <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="mr-2">
                        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                      Add suite
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-md mx-auto mt-6">
              <input
                type="text"
                className="w-full border p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                value={formData.unit || ""}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="Unit (e.g., ms)"
              />
              <button
                onClick={resetSuites}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                Reset suites
              </button>
            </div>

            {output && !output.error && (
              <div className="mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        {Object.values(output.headers).map((header) => (
                          <th key={header} className="border p-2 text-left">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {output.results.map((row) => (
                        <tr key={row.position} className="border">
                          <td className="p-2">{row.position}</td>
                          <td className="p-2">{row.title}</td>
                          <td className="p-2">{row.size}</td>
                          <td className="p-2">{row.mean}</td>
                          <td className="p-2">{row.variance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-center gap-3 mt-4">
                  <button
                    onClick={() => handleCopy(output.markdown)}
                    className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                  >
                    Copy as Markdown table
                  </button>
                  <button
                    onClick={() => handleCopy(output.bulletList)}
                    className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                  >
                    Copy as bullet list
                  </button>
                </div>
              </div>
            )}

            {output?.error && <p className="text-red-600 mt-4">{output.error}</p>}
            <ToastContainer position="bottom-center" autoClose={1000} />
          </div>
        );
      }}
    />
  );
}