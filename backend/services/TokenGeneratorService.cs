using System.Security.Cryptography;
using System.Text;

namespace Backend.Services
{
    public class TokenGeneratorService
    {
        public string GenerateRandomToken(bool includeUppercase, bool includeLowercase, 
            bool includeNumbers, bool includeSymbols, int length)
        {
            const string uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
            const string numberChars = "0123456789";
            const string symbolChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

            StringBuilder charPool = new StringBuilder();
            if (includeUppercase) charPool.Append(uppercaseChars);
            if (includeLowercase) charPool.Append(lowercaseChars);
            if (includeNumbers) charPool.Append(numberChars);
            if (includeSymbols) charPool.Append(symbolChars);

            if (charPool.Length == 0)
            {
                throw new ArgumentException("At least one character type must be selected.");
            }

            char[] pool = charPool.ToString().ToCharArray();
            byte[] randomBytes = RandomNumberGenerator.GetBytes(length);
            char[] result = new char[length];

            for (int i = 0; i < length; i++)
            {
                int index = randomBytes[i] % pool.Length;
                result[i] = pool[index];
            }

            return new string(result);
        }
    }
}