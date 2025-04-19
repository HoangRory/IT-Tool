using Backend.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly AccountService _accountService;

        public AccountController(AuthService authService, AccountService accountService)
        {
            _authService = authService;
            _accountService = accountService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid input" });
            }

            var user = await _authService.ValidateUserAsync(model.Username, model.Password);

            if (user == null)
            {
                return Unauthorized(new { Message = "Invalid username or password" });
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role ?? "user")
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrincipal);

            return Ok(new { Message = "Login successful", Username = user.Username, Role = user.Role ?? "user" });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { Message = "Logout successful" });
        }

        [HttpGet("check")]
        [Authorize]
        public IActionResult CheckAuth()
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            return Ok(new { Username = username, Role = role });
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid input" });
            }

            var success = await _authService.RegisterUserAsync(model.Username, model.Password);
            if (!success)
            {
                return BadRequest(new { Message = "Username already taken" });
            }

            return Ok(new { Message = "Registration successful" });
        }

        [HttpGet("users")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _accountService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("user/{username}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetUserByUsername(string username)
        {
            var user = await _accountService.GetUserByUsernameAsync(username);
            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }
            return Ok(user);
        }

        [HttpPut("user/{username}/role")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateUserRole(string username, [FromBody] UpdateRoleModel model)
        {
            var success = await _accountService.UpdateUserRoleAsync(username, model.Role);
            if (!success)
            {
                return NotFound(new { Message = "User not found or invalid role" });
            }
            return Ok(new { Message = "Role updated successfully" });
        }
    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class RegisterModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class UpdateRoleModel
    {
        public string Role { get; set; }
    }
}