using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToolsController : ControllerBase
    {
        private readonly ToolService _toolService;

        public ToolsController(ToolService toolService)
        {
            _toolService = toolService ?? throw new ArgumentNullException(nameof(toolService));
        }

        [HttpGet("/")]
        [HttpGet("")]
        [HttpGet("list")]
        public async Task<IActionResult> GetAllTools()
        {
            try
            {
                var tools = await _toolService.GetAllToolsAsync();
                
                var result = tools.Select(t => new
                {
                    t.Name,
                    t.Path,
                    Category = t.Category != null ? t.Category.Name : "Uncategorized", // Use Category.Name or fallback
                    t.Description
                });
                
                Console.WriteLine("Fetched Tools:");
                foreach (var tool in result)
                {
                    Console.WriteLine($"Name: {tool.Name}, Path: {tool.Path}, Category: {tool.Category}");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching tools: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while fetching tools." });
            }
        }
    

        [HttpPost("{toolPath}")]
        public async Task<IActionResult> ExecuteToolDynamic(string toolPath, [FromBody] Dictionary<string, object> parameters)
        {
            // var path = $"/api/tools/{toolPath}";
            var tool = await _toolService.GetToolByPathAsync(toolPath);
            if (tool == null)
                return NotFound($"Tool '{toolPath}' not found.");
            Console.WriteLine(tool.Name);
            try
            {
                var result = await tool.ExecuteAsync(parameters);
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
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}