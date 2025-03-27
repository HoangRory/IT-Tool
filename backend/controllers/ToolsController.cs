using Microsoft.AspNetCore.Mvc;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToolsController : ControllerBase
    {
        private readonly WifiQRCodeService _qrService;

        public ToolsController(WifiQRCodeService qrService)
        {
            _qrService = qrService;
        }

        [HttpPost("wifi-qr")]
        public IActionResult GenerateWifiQR([FromBody] WifiRequest request)
        {
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
    }

    public class WifiRequest
    {
        public string? SSID { get; set; }
        public string? Password { get; set; }
    }
}