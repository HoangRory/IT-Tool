using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToolsController : ControllerBase
    {
        private readonly ToolService _toolService;
        private readonly AccountService _accountService;

        public ToolsController(ToolService toolService, AccountService accountService)
        {
            _toolService = toolService ?? throw new ArgumentNullException(nameof(toolService));
            _accountService = accountService ?? throw new ArgumentNullException(nameof(accountService));
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
                    t.Id,
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

        [HttpGet("favorites")]
        [Authorize]
        public async Task<IActionResult> GetFavorites()
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                var userId = await _accountService.GetUserIdByUsernameAsync(username);
                if (userId == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                var favorites = await _toolService.GetFavoritesAsync(userId.Value);
                return Ok(favorites);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching favorites: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while fetching favorites." });
            }
        }

        [HttpPost("favorite")]
        [Authorize]
        public async Task<IActionResult> ToggleFavorite([FromBody] FavoriteModel model)
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                var userId = await _accountService.GetUserIdByUsernameAsync(username);
                if (userId == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                var success = await _toolService.ToggleFavoriteAsync(userId.Value, model.ToolId);
                if (!success)
                {
                    return NotFound(new { Message = "User or tool not found" });
                }
                return Ok(new { Message = "Favorite updated" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error toggling favorite: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while toggling favorite." });
            }
        }
    

        [HttpGet("by-path/{path}")]
        public async Task<IActionResult> GetToolByPath(string path)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                int? parsedUserId = userId != null ? int.Parse(userId) : null;
                var tool = await _toolService.GetToolByPathWithFavoriteAsync(path, parsedUserId);
                if (tool == null)
                {
                    return NotFound(new { Message = "Tool not found" });
                }
                return Ok(tool);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching tool by path: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while fetching the tool." });
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

    public class FavoriteModel
    {
        public int ToolId { get; set; }
    }
}