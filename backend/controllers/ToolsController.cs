using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToolsController : ControllerBase
    {
        private readonly ToolManager _toolManager;

        public ToolsController(ToolManager toolManager)
        {
            _toolManager = toolManager;
        }

        [HttpPost("wifi-qr")]
        public async Task<IActionResult> GenerateWifiQR([FromBody] WifiRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tool = _toolManager.GetTool("/api/tools/wifi-qr");
            if (tool == null)
                return NotFound("WiFi QR Code Generator tool not found.");

            try
            {
                var parameters = new Dictionary<string, object>
                {
                    ["SSID"] = request.SSID,
                    ["Password"] = request.Password
                };
                var result = await tool.ExecuteAsync(parameters);
                if (result is byte[] bytes)
                    return File(bytes, "image/png");
                return BadRequest("Unexpected result format from WiFi QR tool.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("token")]
        public async Task<IActionResult> GenerateToken([FromBody] TokenRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tool = _toolManager.GetTool("/api/tools/token");
            if (tool == null)
                return NotFound("Token Generator tool not found.");

            try
            {
                var parameters = new Dictionary<string, object>
                {
                    ["IncludeUppercase"] = request.IncludeUppercase,
                    ["IncludeLowercase"] = request.IncludeLowercase,
                    ["IncludeNumbers"] = request.IncludeNumbers,
                    ["IncludeSymbols"] = request.IncludeSymbols,
                    ["Length"] = request.Length
                };
                var result = await tool.ExecuteAsync(parameters);
                Console.WriteLine($"Result Type: {result?.GetType()?.FullName}");
                if (result == null)
                    return BadRequest("Result is null from Token Generator tool.");

                if (result is IDictionary<string, object> tokenResult)
                {
                    Console.WriteLine("Result is IDictionary<string, object>");
                    if (tokenResult.TryGetValue("Token", out var token))
                    {
                        Console.WriteLine($"Token: {token}");
                        return Ok(new { Token = token });
                    }
                    else
                    {
                        Console.WriteLine("Token key not found in dictionary");
                        return BadRequest("Token key not found in result.");
                    }
                }
                Console.WriteLine("Result is not IDictionary<string, object>");
                return BadRequest("Unexpected result format from Token Generator tool.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{toolPath}")]
        public async Task<IActionResult> ExecuteTool(string toolPath, [FromBody] Dictionary<string, object> parameters)
        {
            var tool = _toolManager.GetTool($"/api/tools/{toolPath}");
            if (tool == null)
                return NotFound($"Tool '{toolPath}' not found.");

            try
            {
                var result = await tool.ExecuteAsync(parameters);
                if (result is byte[] bytes)
                    return File(bytes, "image/png");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("list")]
        public IActionResult GetToolList()
        {
            var tools = _toolManager.GetAllTools()
                .Select(t => new { t.Name, t.Path, t.Category, t.Description });
            return Ok(tools);
        }

        [HttpPost("upload-plugin")]
        public IActionResult UploadPlugin(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");
            if (!file.FileName.EndsWith(".dll"))
                return BadRequest("Only .dll files are allowed.");

            var pluginsPath = Path.Combine(Directory.GetCurrentDirectory(), "plugins");
            Directory.CreateDirectory(pluginsPath);
            var filePath = Path.Combine(pluginsPath, file.FileName);

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }
                // FileSystemWatcher will handle loading, or trigger manually if needed
                _toolManager.LoadNewPlugins(filePath);
                return Ok($"Plugin {file.FileName} uploaded and loaded.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to upload plugin: {ex.Message}");
            }
        }
            }

    public class WifiRequest
    {
        [Required(ErrorMessage = "SSID is required.")]
        public string SSID { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = string.Empty;
    }

    public class TokenRequest
    {
        public bool IncludeUppercase { get; set; }
        public bool IncludeLowercase { get; set; }
        public bool IncludeNumbers { get; set; }
        public bool IncludeSymbols { get; set; }

        [Range(1, 512, ErrorMessage = "Length must be between 1 and 512.")]
        public int Length { get; set; }
    }
}