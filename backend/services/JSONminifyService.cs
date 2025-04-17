using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class JSONminify : ITool
    {
        public string Name => "JSON Minify";
        public string Path => "/api/tools/json-minify";
        public string Category => "Development";
        public string Description => "Minify and compress your JSON by removing unnecessary whitespace.";

        public async Task<object> ExecuteAsync(Dictionary<string, object> parameters)
        {
            if (parameters.TryGetValue("returnType", out var returnType) &&
                returnType?.ToString()?.ToLower() == "js")
            {
                var jsPath = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "tools", "json-minify.js");
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
