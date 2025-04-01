using Backend.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BaseConverterPlugin
{
    public class BaseConverterTool : ITool
    {
        public string Name => "Integer Base Converter";
        public string Path => "/api/tools/base-converter";
        public string Category => "Math";
        public string Description => "Convert a number between different bases (decimal, hexadecimal, binary, octal, base64, ...)";

        public async Task<object> ExecuteAsync(Dictionary<string, object> parameters)
        {
            // Extract input parameters
            if (!parameters.TryGetValue("Number", out var numberObj) || !parameters.TryGetValue("Base", out var baseObj))
                throw new ArgumentException("Number and Base are required.");

            string numberStr = numberObj.ToString();
            if (!int.TryParse(baseObj.ToString(), out int fromBase) || fromBase < 2 || fromBase > 64)
                throw new ArgumentException("Base must be an integer between 2 and 64.");

            // Parse the input number from the given base
            int decimalValue;
            try
            {
                decimalValue = Convert.ToInt32(numberStr, fromBase);
            }
            catch (Exception ex)
            {
                throw new ArgumentException($"Invalid number '{numberStr}' for base {fromBase}: {ex.Message}");
            }

            // Convert to requested bases
            var result = new Dictionary<string, object>
            {
                ["Binary"] = Convert.ToString(decimalValue, 2),      // Base 2
                ["Octal"] = Convert.ToString(decimalValue, 8),       // Base 8
                ["Decimal"] = decimalValue.ToString(),               // Base 10
                ["Hexadecimal"] = Convert.ToString(decimalValue, 16).ToUpper(), // Base 16
                ["Base64"] = Base64Encode(decimalValue)              // Base 64
            };

            return await Task.FromResult(result);
        }

        // Custom Base64 encoding for an integer
        private string Base64Encode(int value)
        {
            byte[] bytes = BitConverter.GetBytes(value);
            return Convert.ToBase64String(bytes).TrimEnd('=');
        }
    }
}