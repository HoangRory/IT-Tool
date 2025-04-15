using BCrypt.Net;

namespace Backend.Services
{
    class BcryptTool : ITool
    {
        public string Name => "Bcrypt Tool";
        public string Path => "/api/tools/bcrypt";
        public string Category => "Crypto";
        public string Description => "Perform bcrypt hash or compare operations.";

        public async Task<object> ExecuteAsync(Dictionary<string, object> parameters)
        {
            if (parameters.TryGetValue("returnType", out var returnType) &&
                returnType?.ToString()?.ToLower() == "js")
            {
                var jsPath = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "tools", "bcrypt.bundle.js");
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
