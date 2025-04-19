import React, { useState, useEffect } from "react";
import ToolExecutor from "../../components/ToolExecutor";
import { ToastContainer, toast } from "react-toastify";
import { getCountries, getCountryCallingCode } from 'libphonenumber-js/max';
import lookup from 'country-code-lookup';

const getDefaultCountryCode = ({ locale = navigator.language, defaultCode = 'US' } = {}) => {
  const countryCode = locale.split('-')[1]?.toUpperCase();
  return countryCode && lookup.byIso(countryCode) ? lookup.byIso(countryCode).iso2 : defaultCode;
};

export default function PhoneParser() {
  const [defaultCountryCode] = useState(getDefaultCountryCode());
  const countriesOptions = getCountries().map(code => ({
    label: `${lookup.byIso(code)?.country || code} (+${getCountryCallingCode(code)})`,
    value: code,
  }));

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  console.log("Default country:", defaultCountryCode);

  return (
    <ToolExecutor
      toolPath="phone-parser-and-formatter"
      initialInput={{ countryCode: defaultCountryCode, phone: '' }}
      schemaInput={[
        {
          type: "select",
          name: "countryCode",
          label: "Default country code",
          options: countriesOptions,
          value: defaultCountryCode,
          autoRun: true,
        },
        {
          type: "text",
          name: "phone",
          label: "Phone number",
          placeholder: "Enter a phone number",
          autoRun: true,
        },
      ]}
      customRenderer={({ formData, setFormData, output }) => {
        // Log formData to debug initial state
        // console.log("formData:", formData);

        // Ensure countryCode is set on mount
        useEffect(() => {
          if (!formData.countryCode) {
            // console.log("Setting countryCode to default:", defaultCountryCode);
            setFormData({ ...formData, countryCode: defaultCountryCode });
          }
        }, [formData, setFormData, defaultCountryCode]);

        return (
          <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
            <select
              className="w-full border p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
              value={formData.countryCode || defaultCountryCode}
              onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
            >
              {countriesOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <input
              type="text"
              className="w-full border p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter a phone number"
            />

            {output && !output.error && (
              <div className="space-y-2">
                {output.details.map(({ label, value }) => (
                  <div key={label} className="flex justify-between bg-gray-100 px-3 py-2 rounded">
                    <span>{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">{value || 'Unknown'}</span>
                      {value && (
                        <button
                          onClick={() => handleCopy(value)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                            <path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {output?.error && <p className="text-red-600">{output.error}</p>}
            <ToastContainer position="bottom-center" autoClose={1000} />
          </div>
        );
      }}
    />
  );
}