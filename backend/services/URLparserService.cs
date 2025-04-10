using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class UrlParser : ITool
    {
        public string Name => "URL Parser";
        public string Path => "/api/tools/url-parser";
        public string Category => "Web";
        public string Description => "Client-side URL parser tool.";

        public async Task<object> ExecuteAsync(Dictionary<string, object> parameters)
        {
            if (parameters.TryGetValue("returnType", out var returnType) &&
                returnType?.ToString()?.ToLower() == "js")
            {
                var jsPath = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "tools", "url-parser.js");
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
