import React, { useState, useEffect } from "react";
import { Netmask } from "netmask";

const IPv4SubnetCalculator = () => {
  const [address, setAddress] = useState("192.168.0.1/24");
  const [networkInfo, setNetworkInfo] = useState(null);
  const [error, setError] = useState(null);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const calculateSubnetInfo = (input) => {
    setError(null);
    setNetworkInfo(null);

    if (!input.trim()) return;

    try {
      // Handle numeric IP (e.g., "1234" -> "0.0.4.210")
      let cidr = input;
      if (/^\d+$/.test(input)) {
        const ipInt = parseInt(input, 10);
        if (ipInt < 0 || ipInt > 0xffffffff) throw new Error("Numeric IP out of range.");
        const octets = [
          (ipInt >>> 24) & 255,
          (ipInt >>> 16) & 255,
          (ipInt >>> 8) & 255,
          ipInt & 255,
        ];
        cidr = `${octets.join(".")}/32`;
      }

      const block = new Netmask(cidr);
      const firstOctet = parseInt(block.base.split(".")[0], 10);
      const ipClass =
        firstOctet >= 1 && firstOctet <= 126 ? "A" :
        firstOctet >= 128 && firstOctet <= 191 ? "B" :
        firstOctet >= 192 && firstOctet <= 223 ? "C" :
        firstOctet >= 224 && firstOctet <= 239 ? "D" :
        firstOctet >= 240 && firstOctet <= 255 ? "E" : "Unknown class type";

      setNetworkInfo({
        netmask: block.toString(),
        networkAddress: block.base,
        networkMask: block.mask,
        networkMaskBinary: ("1".repeat(block.bitmask) + "0".repeat(32 - block.bitmask)).match(/.{8}/g).join("."),
        cidrNotation: `/${block.bitmask}`,
        wildcardMask: block.hostmask,
        networkSize: block.size,
        firstAddress: block.first,
        lastAddress: block.last,
        broadcastAddress: block.broadcast || "No broadcast address with this mask",
        ipClass,
      });
    } catch (err) {
      setError(err.message || "Invalid IPv4 CIDR format.");
    }
  };

  const debouncedCalculate = debounce(calculateSubnetInfo, 300);

  useEffect(() => {
    debouncedCalculate(address);
  }, [address]);

  const switchToBlock = (count) => {
    if (!networkInfo) return;
    try {
      const block = new Netmask(address);
      const newBlock = block.next(count);
      if (newBlock) {
        setAddress(newBlock.toString());
      }
    } catch (err) {
      setError("Unable to switch block: " + err.message);
    }
  };

  const sections = [
    { label: "Netmask", key: "netmask" },
    { label: "Network address", key: "networkAddress" },
    { label: "Network mask", key: "networkMask" },
    { label: "Network mask in binary", key: "networkMaskBinary" },
    { label: "CIDR notation", key: "cidrNotation" },
    { label: "Wildcard mask", key: "wildcardMask" },
    { label: "Network size", key: "networkSize" },
    { label: "First address", key: "firstAddress" },
    { label: "Last address", key: "lastAddress" },
    { label: "Broadcast address", key: "broadcastAddress", undefinedFallback: "No broadcast address with this mask" },
    { label: "IP class", key: "ipClass", undefinedFallback: "Unknown class type" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">IPv4 Subnet Calculator</h1>
      <p className="text-gray-600 mb-6">
        Parse your IPv4 CIDR blocks and get all the info you need about your subnet.
      </p>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            An IPv4 address with or without mask
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g., 192.168.0.1/24 or 1234"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        {networkInfo && (
          <div>
            <table className="w-full border-collapse">
              <tbody>
                {sections.map(({ label, key, undefinedFallback }) => (
                  <tr key={label} className="border-b">
                    <td className="py-2 font-bold text-gray-700">{label}</td>
                    <td className="py-2">
                      {networkInfo[key] ? (
                        <span className="text-gray-800">{networkInfo[key]}</span>
                      ) : (
                        <span className="text-gray-500 opacity-70">
                          {undefinedFallback || ""}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={() => switchToBlock(-1)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous block
              </button>
              <button
                onClick={() => switchToBlock(1)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next block
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPv4SubnetCalculator;