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
        public string Path => "/api/tools/token-generator";
        public string Category => "Crypto";
        public string Description => "Generate random string with the chars you want, uppercase or lowercase letters, numbers and/or symbols.";

        public async Task<object> ExecuteAsync(Dictionary<string, object> parameters)
        {
            bool includeUppercase = (bool)parameters["IncludeUppercase"];
            bool includeLowercase = (bool)parameters["IncludeLowercase"];
            bool includeNumbers = (bool)parameters["IncludeNumbers"];
            bool includeSymbols = (bool)parameters["IncludeSymbols"];
            int length = (int)parameters["Length"];

            StringBuilder charPool = new StringBuilder();
            if (includeUppercase) charPool.Append("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
            if (includeLowercase) charPool.Append("abcdefghijklmnopqrstuvwxyz");
            if (includeNumbers) charPool.Append("0123456789");
            if (includeSymbols) charPool.Append("!@#$%^&*()-_=+[]{}|;:,.<>?");

            if (charPool.Length == 0)
                throw new ArgumentException("At least one character type must be selected.");

            char[] pool = charPool.ToString().ToCharArray();
            byte[] randomBytes = RandomNumberGenerator.GetBytes(length);
            char[] result = new char[length];

            for (int i = 0; i < length; i++)
            {
                int index = randomBytes[i] % pool.Length;
                result[i] = pool[index];
            }

            var tokenResult = new Dictionary<string, object>
            {
                ["Token"] = new string(result)
            };
            return await Task.FromResult(tokenResult);
        }
    }
}