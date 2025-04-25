using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Backend.Models;
using Backend.Helpers;

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

        [HttpGet("list")]
        [Authorize(Roles = "admin")]
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
                    t.Description,
                    t.IsPremium,
                    t.IsEnabled
                });

                Console.WriteLine("Fetched Tools:");
                foreach (var tool in result)
                {
                    Console.WriteLine($"Name: {tool.Name}, Path: {tool.Path}, Category: {tool.Category}, Premium: {(tool.IsPremium ?? false ? "Yes" : "No")}");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching tools: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while fetching tools." });
            }
        }
        [HttpPost("upload-plugin")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UploadPlugin([FromForm] PluginUploadModel model)
        {
            try
            {
                var validationResult = PluginHelper.ValidatePluginUploadModel(model);
                if (validationResult != null)
                    return validationResult;

                await PluginHelper.SavePluginFileAsync(model.JsFile!, model.Path!);
                string inputSchema = await PluginHelper.ReadFileContentAsync(model.InputSchema!);
                string outputSchema = await PluginHelper.ReadFileContentAsync(model.OutputSchema!);


                var tool = new Tool
                {
                    Name = model.Name,
                    Description = model.Description,
                    Path = model.Path,
                    CategoryId = model.CategoryId,
                    IsPremium = false,
                    IsEnabled = true,
                    InputSchema = inputSchema,
                    OutputSchema = outputSchema
                };

                var result = await _toolService.AddToolAsync(tool);
                if (!result)
                    return BadRequest("Tool already exists or failed to add tool.");

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error uploading plugin: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while uploading the plugin." });
            }
        }

        [HttpDelete("{toolId}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteTool(int toolId)
        {
            try
            {
                string path = await _toolService.GetPathByIdAsync(toolId);
                if (string.IsNullOrEmpty(path))
                {
                    return NotFound(new { Message = "Tool not found" });
                }
                var success = await _toolService.DeleteToolAsync(toolId);
                if (!success)
                {
                    return NotFound(new { Message = "Tool not found" });
                }
                // Delete the file from the server
                var isDeleted = PluginHelper.DeletePluginFileAsync(path);
                if (!isDeleted)
                {
                    return StatusCode(500, new { error = "Failed to delete the plugin file." });
                }
                
                return Ok(new { Message = "Tool deleted successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting tool: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while deleting the tool." });
            }
        }


        [HttpGet("/")]
        [HttpGet("")]
        [HttpGet("enabled")]
        public async Task<IActionResult> GetEnabledTools()
        {
            try
            {
                var tools = await _toolService.GetEnabledToolsAsync();

                var result = tools.Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.Path,
                    Category = t.Category != null ? t.Category.Name : "Uncategorized",
                    t.Description,
                    t.IsPremium,
                    t.IsEnabled,
                    t.InputSchema,
                    t.OutputSchema
                });

                Console.WriteLine("Fetched Tools:");
                foreach (var tool in result)
                {
                    Console.WriteLine($"Name: {tool.Name}, Path: {tool.Path}, Category: {tool.Category}, Premium: {(tool.IsPremium ?? false ? "Yes" : "No")}, input: {tool.InputSchema}, output: {tool.OutputSchema}");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching enabled tools: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while fetching enabled tools." });
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
            if (tool.IsPremium ?? false)
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "anonymous";

                if (userRole != "premium" && userRole != "admin")
                {
                    return StatusCode(StatusCodes.Status403Forbidden, "Bạn cần quyền Premium để sử dụng công cụ này.");

                }
            }
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

        [HttpPut("{toolId}/premium")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateToolPremiumStatus(int toolId, [FromBody] UpdateToolStatusModel model)
        {
            try
            {
                var success = await _toolService.UpdateToolPremiumStatusAsync(toolId, model.IsPremium);
                if (!success)
                {
                    return NotFound(new { Message = "Tool not found" });
                }
                return Ok(new { Message = "Tool premium status updated successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating tool premium status: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while updating tool premium status." });
            }
        }

        [HttpPut("{toolId}/enabled")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateToolEnabledStatus(int toolId, [FromBody] UpdateToolStatusModel model)
        {
            try
            {
                var success = await _toolService.UpdateToolEnabledStatusAsync(toolId, model.IsEnabled);
                if (!success)
                {
                    return NotFound(new { Message = "Tool not found" });
                }
                return Ok(new { Message = "Tool enabled status updated successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating tool enabled status: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while updating tool enabled status." });
            }
        }

    }

    public class FavoriteModel
    {
        public int ToolId { get; set; }
    }

    public class UpdateToolStatusModel
    {
        public bool IsPremium { get; set; }
        public bool IsEnabled { get; set; }
    }
}