// BaseConverterService.cs
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class BaseConverterService : ITool
    {
        private const string DIGITS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";

        public string Name => "Integer Base Converter";
        public string Path => "/api/tools/base-converter";
        public string Category => "Math";
        public string Description => "Convert a number between different bases (decimal, hexadecimal, binary, octal, base64, and custom bases 2-64)";

        public async Task<object> ExecuteAsync(Dictionary<string, object> parameters)
        {
            Console.WriteLine($"Raw parameters: {string.Join(", ", parameters)}");

            if (!parameters.TryGetValue("Number", out var numberObj) || 
                !parameters.TryGetValue("Base", out var baseObj))
            {
                Console.WriteLine("Missing Number or Base");
                throw new ArgumentException("Number and Base are required.");
            }

            string numberStr = numberObj?.ToString()?.Trim();
            if (string.IsNullOrEmpty(numberStr))
            {
                Console.WriteLine("Number is empty");
                throw new ArgumentException("Number cannot be empty");
            }

            string baseStr = baseObj?.ToString();
            if (!int.TryParse(baseStr, out int fromBase) || fromBase < 2 || fromBase > 64)
            {
                Console.WriteLine($"Invalid Base: {baseStr}");
                throw new ArgumentException("Base must be an integer between 2 and 64");
            }

            int? customBase = null;
            if (parameters.TryGetValue("CustomBase", out var customBaseObj) && customBaseObj != null)
            {
                string customBaseStr = customBaseObj.ToString().Trim();
                if (!string.IsNullOrEmpty(customBaseStr) && 
                    int.TryParse(customBaseStr, out int cb) && 
                    cb >= 2 && cb <= 64)
                {
                    customBase = cb;
                }
                else
                {
                    Console.WriteLine($"Invalid CustomBase: '{customBaseStr}'");
                }
            }

            int decimalValue;
            try
            {
                Console.WriteLine($"Parsing '{numberStr}' from base {fromBase}");
                decimalValue = ParseFromCustomBase(numberStr, fromBase);
                Console.WriteLine($"Parsed to decimal: {decimalValue}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Parse error: {ex.Message}");
                throw new ArgumentException($"Invalid number '{numberStr}' for base {fromBase}: {ex.Message}");
            }

            var result = new Dictionary<string, object>
            {
                ["Binary"] = Convert.ToString(decimalValue, 2),
                ["Octal"] = Convert.ToString(decimalValue, 8),
                ["Decimal"] = decimalValue.ToString(),
                ["Hexadecimal"] = Convert.ToString(decimalValue, 16).ToLower(),
                ["Base64"] = ConvertToCustomBase(decimalValue, 64)
            };

            if (customBase.HasValue)
            {
                try
                {
                    result["CustomBase"] = ConvertToCustomBase(decimalValue, customBase.Value);
                    result["CustomBaseNumber"] = customBase.Value.ToString();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Custom base conversion error: {ex.Message}");
                }
            }

            Console.WriteLine($"Returning result: {string.Join(", ", result)}");
            return await Task.FromResult(result);
        }

        private int ParseFromCustomBase(string number, int fromBase)
        {
            number = number.Trim().ToUpper();
            bool isNegative = number.StartsWith("-");
            if (isNegative) number = number.Substring(1);

            int result = 0;
            for (int i = 0; i < number.Length; i++)
            {
                int digitValue = DIGITS.IndexOf(number[i]);
                if (digitValue < 0 || digitValue >= fromBase)
                    throw new FormatException($"Invalid digit '{number[i]}' for base {fromBase}");
                
                checked
                {
                    result = result * fromBase + digitValue;
                }
            }

            return isNegative ? -result : result;
        }

        private string ConvertToCustomBase(int value, int baseValue)
        {
            if (baseValue < 2 || baseValue > 64)
                throw new ArgumentException("Base must be between 2 and 64");

            if (value == 0) return "0";

            bool isNegative = value < 0;
            value = Math.Abs(value);
            string result = "";

            while (value > 0)
            {
                int remainder = value % baseValue;
                result = DIGITS[remainder] + result;
                value /= baseValue;
            }

            return isNegative ? "-" + result : result;
        }
    }
}