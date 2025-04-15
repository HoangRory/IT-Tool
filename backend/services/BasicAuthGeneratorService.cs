using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class BasicAuthGenerator : ITool
    {
        public string Name => "Basic Auth Generator";
        public string Path => "/api/tools/basic-auth-generator";
        public string Category => "Web";
        public string Description => "Generate a base64 basic auth header from a username and password.";

        public async Task<object> ExecuteAsync(Dictionary<string, object> parameters)
        {
            if (parameters.TryGetValue("returnType", out var returnType) &&
                returnType?.ToString()?.ToLower() == "js")
            {
                var jsPath = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "tools", "basic-auth-generator.js");
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
