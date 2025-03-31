using System.Security.Cryptography;
using System.Text;

namespace Backend.Services
{
    public class TokenGeneratorService : ITool
    {
        // Define character sets as constants
        private const string UppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        private const string LowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        private const string NumberChars = "0123456789";
        private const string SymbolChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

        public string Name => "Token Generator";
        public string Path => "/api/tools/token";
        public string Category => "Crypto";

        public async Task<object> ExecuteAsync(Dictionary<string, object> parameters)
        {
            // Extract parameters with type safety
            bool includeUppercase = (bool)parameters["IncludeUppercase"];
            bool includeLowercase = (bool)parameters["IncludeLowercase"];
            bool includeNumbers = (bool)parameters["IncludeNumbers"];
            bool includeSymbols = (bool)parameters["IncludeSymbols"];
            int length = (int)parameters["Length"];

            // Build the character pool
            StringBuilder charPool = new StringBuilder();
            if (includeUppercase) charPool.Append(UppercaseChars);
            if (includeLowercase) charPool.Append(LowercaseChars);
            if (includeNumbers) charPool.Append(NumberChars);
            if (includeSymbols) charPool.Append(SymbolChars);

            // Validate the pool
            if (charPool.Length == 0)
            {
                throw new ArgumentException("At least one character type must be selected.");
            }

            // Generate the token
            char[] pool = charPool.ToString().ToCharArray();
            byte[] randomBytes = RandomNumberGenerator.GetBytes(length);
            char[] result = new char[length];

            for (int i = 0; i < length; i++)
            {
                int index = randomBytes[i] % pool.Length;
                result[i] = pool[index];
            }

            // Return the result as an anonymous object
            return await Task.FromResult(new { Token = new string(result) });
        }
    }
}