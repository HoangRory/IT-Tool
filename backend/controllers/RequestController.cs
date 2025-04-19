using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestController : ControllerBase
    {
        private readonly RequestService _requestService;

        public RequestController(RequestService requestService)
        {
            _requestService = requestService ?? throw new ArgumentNullException(nameof(requestService));
        }

        [HttpGet("upgrade-requests")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllUpgradeRequests()
        {
            try
            {
                var requests = await _requestService.GetAllUpgradeRequestsAsync();

                var result = requests.Select(r => new
                {
                    r.Id,
                    r.UserId,
                    UserName = r.User?.Username ?? "Unknown",
                    UserEmail = r.User?.Email ?? "Unknown",
                    r.Status,
                    r.TimeCreated
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching upgrade requests: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while fetching upgrade requests." });
            }
        }

        [HttpPut("upgrade-requests/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateUpgradeRequest(int id, [FromBody] UpdateRequestModel model)
        {
            try
            {
                if (model == null || string.IsNullOrEmpty(model.Status))
                {
                    return BadRequest(new { Message = "Status is required" });
                }

                if (model.Status != "Accepted" && model.Status != "Denied")
                {
                    return BadRequest(new { Message = "Status must be 'Accepted' or 'Denied'" });
                }

                var updateUserRoleToPremium = model.Status == "Accepted";
                var success = await _requestService.UpdateRequestStatusAsync(id, model.Status, updateUserRoleToPremium);

                if (!success)
                {
                    return NotFound(new { Message = "Upgrade request not found" });
                }

                return Ok(new { Message = $"Upgrade request {model.Status.ToLower()} successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating upgrade request: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while updating the upgrade request." });
            }
        }
    }
    public class UpdateRequestModel
    {
        public string Status { get; set; }
    }
}