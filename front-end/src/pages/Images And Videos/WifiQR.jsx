import React from "react";
import ToolExecutor from "../../components/ToolExecutor";
import { ToastContainer, toast } from "react-toastify";

export default function WifiQRCodeGenerator() {
  const handleDownload = (dataUrl) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "wifi-qr-code.png";
    link.click();
    toast.success("WiFi QR code downloaded!");
  };

  const encryptionOptions = [
    { label: "WPA/WPA2", value: "WPA" },
    { label: "No Password", value: "nopass" },
    { label: "WEP", value: "WEP" },
    { label: "WPA2-EAP", value: "WPA2-EAP" },
  ];

  const eapMethods = [
    "MD5",
    "POTP",
    "GTC",
    "TLS",
    "IKEv2",
    "SIM",
    "AKA",
    "AKA'",
    "TTLS",
    "PWD",
    "LEAP",
    "PSK",
    "FAST",
    "TEAP",
    "EKE",
    "NOOB",
    "PEAP",
  ].map((method) => ({ label: method, value: method }));

  const eapPhase2Methods = ["None", "MSCHAPV2"].map((method) => ({
    label: method,
    value: method,
  }));

  return (
    <ToolExecutor
      toolPath="wifi-qr"
      initialInput={{
        encryption: "WPA",
        ssid: "",
        isHiddenSSID: false,
        password: "",
        eapMethod: "PEAP",
        eapIdentity: "",
        eapAnonymous: false,
        eapPhase2Method: "None",
        foreground: "#000000ff",
        background: "#ffffffff",
      }}
      schemaInput={[
        {
          type: "select",
          name: "encryption",
          label: "Encryption Method",
          options: encryptionOptions,
          autoRun: true,
        },
        {
          type: "text",
          name: "ssid",
          label: "SSID",
          placeholder: "Your WiFi SSID...",
          autoRun: true,
        },
        {
          type: "checkbox",
          name: "isHiddenSSID",
          label: "Hidden SSID",
          autoRun: true,
        },
        {
          type: "text",
          name: "password",
          label: "Password",
          placeholder: "Your WiFi Password...",
          autoRun: true,
        },
        {
          type: "select",
          name: "eapMethod",
          label: "EAP Method",
          options: eapMethods,
          autoRun: true,
        },
        {
          type: "text",
          name: "eapIdentity",
          label: "Identity",
          placeholder: "Your EAP Identity...",
          autoRun: true,
        },
        {
          type: "checkbox",
          name: "eapAnonymous",
          label: "Anonymous",
          autoRun: true,
        },
        {
          type: "select",
          name: "eapPhase2Method",
          label: "EAP Phase 2 Method",
          options: eapPhase2Methods,
          autoRun: true,
        },
        {
          type: "text",
          name: "foreground",
          label: "Foreground Color",
          placeholder: "#000000ff",
          autoRun: true,
        },
        {
          type: "text",
          name: "background",
          label: "Background Color",
          placeholder: "#ffffffff",
          autoRun: true,
        },
      ]}
      customRenderer={({ formData, setFormData, output }) => (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Encryption Method</label>
                <select
                  value={formData.encryption || "WPA"}
                  onChange={(e) => setFormData({ ...formData, encryption: e.target.value })}
                  className="w-full border p-2 rounded"
                >
                  {encryptionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block mb-2">SSID</label>
                  <input
                    type="text"
                    value={formData.ssid || ""}
                    onChange={(e) => setFormData({ ...formData, ssid: e.target.value })}
                    placeholder="Your WiFi SSID..."
                    className="w-full border p-2 rounded"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isHiddenSSID || false}
                    onChange={(e) => setFormData({ ...formData, isHiddenSSID: e.target.checked })}
                  />
                  Hidden SSID
                </label>
              </div>
              {formData.encryption !== "nopass" && (
                <div>
                  <label className="block mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password || ""}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Your WiFi Password..."
                    className="w-full border p-2 rounded"
                  />
                </div>
              )}
              {formData.encryption === "WPA2-EAP" && (
                <>
                  <div>
                    <label className="block mb-2">EAP Method</label>
                    <select
                      value={formData.eapMethod || "PEAP"}
                      onChange={(e) => setFormData({ ...formData, eapMethod: e.target.value })}
                      className="w-full border p-2 rounded"
                    >
                      {eapMethods.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block mb-2">Identity</label>
                      <input
                        type="text"
                        value={formData.eapIdentity || ""}
                        onChange={(e) => setFormData({ ...formData, eapIdentity: e.target.value })}
                        placeholder="Your EAP Identity..."
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.eapAnonymous || false}
                        onChange={(e) => setFormData({ ...formData, eapAnonymous: e.target.checked })}
                      />
                      Anonymous
                    </label>
                  </div>
                  <div>
                    <label className="block mb-2">EAP Phase 2 Method</label>
                    <select
                      value={formData.eapPhase2Method || "None"}
                      onChange={(e) => setFormData({ ...formData, eapPhase2Method: e.target.value })}
                      className="w-full border p-2 rounded"
                    >
                      {eapPhase2Methods.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className="block mb-2">Foreground Color</label>
                <input
                  type="color"
                  value={formData.foreground || "#000000ff"}
                  onChange={(e) => setFormData({ ...formData, foreground: e.target.value })}
                  className="w-20 h-10 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Background Color</label>
                <input
                  type="color"
                  value={formData.background || "#ffffffff"}
                  onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                  className="w-20 h-10 border rounded"
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              {output && !output.error && (
                <>
                  <img
                    src={output.qrcode}
                    alt="WiFi QR Code"
                    style={{ width: "200px", height: "200px" }}
                  />
                  <button
                    onClick={() => handleDownload(output.qrcode)}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                  >
                    Download WiFi QR Code
                  </button>
                </>
              )}
              {output?.error && <p className="text-red-600">{output.error}</p>}
            </div>
          </div>
          <ToastContainer position="bottom-center" autoClose={1000} />
        </div>
      )}
    />
  );
}