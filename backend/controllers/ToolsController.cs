using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using System.ComponentModel.DataAnnotations;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToolsController : ControllerBase
    {
        private readonly ToolManager _toolManager;
        private readonly ToolService _toolService;

        public ToolsController(ToolManager toolManager, ToolService toolService)
        {
            _toolManager = toolManager;
            _toolService = toolService ?? throw new ArgumentNullException(nameof(toolService));
        }

        // New route: GET api/tools
        [HttpGet("/")]
        [HttpGet("")]
        public async Task<IActionResult> GetAllTools()
        {
            var tools = await _toolService.GetAllToolsAsync();
            
            // Print tools to console
            Console.WriteLine("Fetched Tools:");
            foreach (var tool in tools)
            {
                Console.WriteLine($"ID: {tool.Id}, Name: {tool.Name}");
            }

            return Ok(tools);
        }
    

        [HttpPost("{toolPath}")]
        public Task<IActionResult> ExecuteToolDynamic(string toolPath, [FromBody] Dictionary<string, object> parameters) =>
            ExecuteToolAsync($"/api/tools/{toolPath}", parameters, result =>
            {
                switch (result)
                {
                    case ContentResult contentResult:
                        return contentResult;

                    case byte[] bytes:
                        var isJsFile = parameters.TryGetValue("returnType", out var returnType) &&
                                    returnType?.ToString()?.ToLower() == "js";
                        if (isJsFile)
                            return File(bytes, "application/javascript", $"{toolPath}.js");

                        return File(bytes, "image/png");

                    default:
                        return Ok(result);
                }
            });

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
                _toolManager.LoadNewPlugins(filePath);
                return Ok($"Plugin {file.FileName} uploaded and loaded.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to upload plugin: {ex.Message}");
            }
        }
        private async Task<IActionResult> ExecuteToolAsync(string path, Dictionary<string, object> parameters, Func<object, IActionResult> resultHandler)
        {
            var tool = _toolManager.GetTool(path);
            if (tool == null)
                return NotFound($"Tool '{path}' not found.");

            try
            {
                var result = await tool.ExecuteAsync(parameters);
                return resultHandler(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
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
    public class BcryptHashRequest
    {
        [Required(ErrorMessage = "Input is required.")]
        public string Input { get; set; } = string.Empty;
        [Required(ErrorMessage = "Salt rounds are required.")]
        public int SaltRounds { get; set; } = 10;
    }
    public class BcryptCompareRequest
    {
        [Required(ErrorMessage = "Input is required.")]
        public string Input { get; set; } = string.Empty;
        [Required(ErrorMessage = "Hash is required.")]
        public string Hash { get; set; } = string.Empty;
    }
    public class HashRequest
    {
        [Required(ErrorMessage = "Input is required.")]
        public string Input { get; set; } = string.Empty;
        [Required(ErrorMessage = "Encoding is required.")]
        public string Encoding { get; set; } = string.Empty;
    }
}