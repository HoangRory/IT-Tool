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
            if (parameters.TryGetValue("returnType", out var returnType) &&
                returnType?.ToString()?.ToLower() == "js")
            {
                var jsPath = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "tools", "hash-text.bundle.js");
                if (!File.Exists(jsPath))
                    throw new FileNotFoundException($"JS file not found: {jsPath}");

                return new Microsoft.AspNetCore.Mvc.ContentResult
                {
                    Content = await File.ReadAllTextAsync(jsPath),
                    ContentType = "application/javascript",
                    StatusCode = 200
                };
            }
            return new { error = "Only returnType: js is supported." };
        }
    }
}
