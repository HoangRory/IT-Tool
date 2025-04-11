using System.Security.Cryptography;
using System.Text;
using Org.BouncyCastle.Crypto.Digests;

namespace Backend.Services
{
    class HashText : ITool
    {
        public string Name => "Hash Text";
        public string Path => "/api/tools/hash-text";
        public string Category => "Crypto";
        public string Description => "Generate hashes of the input text using various algorithms.";

        public async Task<object> ExecuteAsync(Dictionary<string, object> parameters)
        {
            if (!parameters.TryGetValue("input", out var inputObj))
            {
                throw new ArgumentException("Missing 'input' parameter in the request.");
            }
            string text = inputObj.ToString() ?? string.Empty;


            if (!parameters.TryGetValue("encoding", out var encodingObj))
                throw new ArgumentException("Missing 'encoding' parameter in the request.");
            string encodingName = encodingObj.ToString() ?? string.Empty;

            // Sử dụng UTF8 mặc định để chuyển text thành byte[]
            byte[] inputBytes = Encoding.UTF8.GetBytes(text);

            var hashResults = new Dictionary<string, string>
            {
                ["MD5"] = ComputeHash(MD5.Create(), inputBytes, encodingName),
                ["SHA1"] = ComputeHash(SHA1.Create(), inputBytes, encodingName),
                ["SHA256"] = ComputeHash(SHA256.Create(), inputBytes, encodingName),
                ["SHA224"] = ComputeBouncyHash(new Sha224Digest(), inputBytes, encodingName),
                ["SHA384"] = ComputeHash(SHA384.Create(), inputBytes, encodingName),
                ["SHA512"] = ComputeHash(SHA512.Create(), inputBytes, encodingName),
                ["RIPEMD160"] = ComputeBouncyHash(new RipeMD160Digest(), inputBytes, encodingName),
                ["SHA3"] = ComputeBouncyHash(new Sha3Digest(384), inputBytes, encodingName) // SHA3 = SHA3-512
            };

            

            return await Task.FromResult(new { output = hashResults });
        }

        private static string ComputeHash(HashAlgorithm algorithm, byte[] inputBytes, string encoding)
        {
            using (algorithm)
            {
                var hashBytes = algorithm.ComputeHash(inputBytes);
                return FormatHash(hashBytes, encoding);
            }
        }

        private static string ComputeBouncyHash(Org.BouncyCastle.Crypto.IDigest digest, byte[] input, string encoding)
        {
            digest.BlockUpdate(input, 0, input.Length);
            byte[] result = new byte[digest.GetDigestSize()];
            digest.DoFinal(result, 0);
            return FormatHash(result, encoding);
        }

        private static string FormatHash(byte[] hashBytes, string encoding)
        {
            switch (encoding.ToUpperInvariant())
            {
                case "BASE64":
                    return Convert.ToBase64String(hashBytes);

                case "BASE64URL":
                    return Convert.ToBase64String(hashBytes)
                        .Replace('+', '-')
                        .Replace('/', '_')
                        .TrimEnd('=');

                case "BINARY":
                    return string.Join("", hashBytes.Select(b => Convert.ToString(b, 2).PadLeft(8, '0')));

                case "HEX":
                default:
                    return BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();
            }
        }
    }
}
