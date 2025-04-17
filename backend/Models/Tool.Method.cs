namespace Backend.Models;

public partial class Tool 
{
    public async Task<object> ExecuteAsync(Dictionary<string, object> parameters)
        {
            if (parameters.TryGetValue("returnType", out var returnType) &&
                returnType?.ToString()?.ToLower() == "js")
            {
                if (Path?.ToString() == null)
                    throw new FileNotFoundException($"Tool {Name} has no path specified:");
                var tool_js = $"{Path?.ToString()}.js";
                var tool_bundle_js = $"{Path?.ToString()}.bundle.js";
                var jsPath = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "tools", tool_js);
                var bundlePath = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "tools", tool_bundle_js);
                // Console.WriteLine(jsPath);

                string? selectedPath = null;
                if (File.Exists(jsPath))
                    selectedPath = jsPath;
                else if (File.Exists(bundlePath))
                    selectedPath = bundlePath;
                else
                    throw new FileNotFoundException($"JS file not found: {jsPath}");

                return new Microsoft.AspNetCore.Mvc.ContentResult
                {
                    Content = await File.ReadAllTextAsync(selectedPath),
                    ContentType = "application/javascript",
                    StatusCode = 200
                };

            }

            return new { error = "Only returnType: js is supported." };
        } 
}