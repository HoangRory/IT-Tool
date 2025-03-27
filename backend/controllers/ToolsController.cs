using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToolsController : ControllerBase
    {
        private readonly WifiQRCodeService _qrService;
        private readonly TokenGeneratorService _tokenService;

        public ToolsController(WifiQRCodeService qrService, TokenGeneratorService tokenService)
        {
            _qrService = qrService;
            _tokenService = tokenService;
        }

        [HttpPost("wifi-qr")]
        public IActionResult GenerateWifiQR([FromBody] WifiRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var qrCodeBytes = _qrService.GenerateWifiQRCode(request.SSID, request.Password);
                return File(qrCodeBytes, "image/png");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("token")]
        public IActionResult GenerateToken([FromBody] TokenRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string token = _tokenService.GenerateRandomToken(
                    request.IncludeUppercase,
                    request.IncludeLowercase,
                    request.IncludeNumbers,
                    request.IncludeSymbols,
                    request.Length
                );
                return Ok(new { Token = token });
            }
            catch (ArgumentException ex)
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
}