using System.Text;

namespace Backend.Services
{
    public class RomanNumeralConverterService : ITool
    {
        private static readonly Dictionary<char, int> RomanValues = new Dictionary<char, int>
        {
            {'I', 1},
            {'V', 5},
            {'X', 10},
            {'L', 50},
            {'C', 100},
            {'D', 500},
            {'M', 1000}
        };

        private static readonly List<(int Value, string Symbol)> DecimalToRoman = new List<(int, string)>
        {
            (1000, "M"),
            (900, "CM"),
            (500, "D"),
            (400, "CD"),
            (100, "C"),
            (90, "XC"),
            (50, "L"),
            (40, "XL"),
            (10, "X"),
            (9, "IX"),
            (5, "V"),
            (4, "IV"),
            (1, "I")
        };

        public string Name => "Roman Numeral Converter";
        public string Path => "/api/tools/roman-numeral-converter";
        public string Category => "Converter";
        public string Description => "Convert between Roman numerals and decimal numbers (1-3999)";

        public async Task<object> ExecuteAsync(Dictionary<string, object> parameters)
        {
            if (!parameters.TryGetValue("Input", out var inputObj))
                throw new ArgumentException("Input is required.");

            string inputStr = inputObj?.ToString()?.Trim();
            if (string.IsNullOrEmpty(inputStr))
                throw new ArgumentException("Input cannot be empty");

            var result = new Dictionary<string, object>();

            // Try converting from Roman numeral to decimal
            if (IsRomanNumeral(inputStr))
            {
                try
                {
                    int decimalValue = RomanToDecimal(inputStr);
                    result["Decimal"] = decimalValue.ToString();
                    result["InputType"] = "Roman";
                    result["Input"] = inputStr;
                }
                catch (Exception ex)
                {
                    throw new ArgumentException($"Invalid Roman numeral '{inputStr}': {ex.Message}");
                }
            }
            // Try converting from decimal to Roman numeral
            else if (int.TryParse(inputStr, out int number))
            {
                if (number < 1 || number > 3999)
                    throw new ArgumentException("Number must be between 1 and 3999 for Roman numeral conversion");

                string romanValue = DecimalToRomanNumeral(number);
                result["Roman"] = romanValue;
                result["InputType"] = "Decimal";
                result["Input"] = number.ToString();
            }
            else
            {
                throw new ArgumentException("Input must be a valid Roman numeral or a number between 1 and 3999");
            }

            return await Task.FromResult(result);
        }

        private bool IsRomanNumeral(string input)
        {
            input = input.ToUpper();
            foreach (char c in input)
            {
                if (!RomanValues.ContainsKey(c))
                    return false;
            }
            return true;
        }

        private int RomanToDecimal(string roman)
        {
            roman = roman.ToUpper();
            int result = 0;
            int prevValue = 0;

            for (int i = roman.Length - 1; i >= 0; i--)
            {
                int currentValue = RomanValues[roman[i]];

                if (currentValue >= prevValue)
                {
                    result += currentValue;
                }
                else
                {
                    result -= currentValue;
                }
                prevValue = currentValue;
            }

            // Basic validation
            if (result < 1 || result > 3999 || DecimalToRomanNumeral(result) != roman)
                throw new ArgumentException("Invalid Roman numeral sequence");

            return result;
        }

        private string DecimalToRomanNumeral(int number)
        {
            if (number < 1 || number > 3999)
                throw new ArgumentException("Number must be between 1 and 3999");

            StringBuilder roman = new StringBuilder();
            foreach (var (value, symbol) in DecimalToRoman)
            {
                while (number >= value)
                {
                    roman.Append(symbol);
                    number -= value;
                }
            }
            return roman.ToString();
        }
    }
}