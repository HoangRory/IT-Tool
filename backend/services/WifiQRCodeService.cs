using QRCoder;
using System.Text;

namespace Backend.Services
{
    public class WifiQRCodeService : ITool
    {
        public string Name => "WiFi QR Code Generator";
        public string Path => "/api/tools/wifi-qr";
        public string Category => "Image/Video";
        public string Description => "Generate and download QR codes for quick connections to WiFi networks.";
        public async Task<object> ExecuteAsync(Dictionary<string, object> parameters)
        {
            if (!parameters.TryGetValue("SSID", out var ssidObj) || ssidObj is not string ssid || string.IsNullOrWhiteSpace(ssid))
                throw new ArgumentException("SSID is required and must be a non-empty string.");
            if (!parameters.TryGetValue("Password", out var pwdObj) || pwdObj is not string password || string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("Password is required and must be a non-empty string.");

            string wifiPayload = $"WIFI:S:{EscapeSpecialCharacters(ssid)};T:WPA;P:{EscapeSpecialCharacters(password)};;";

            using var qrGenerator = new QRCodeGenerator();
            var qrCodeData = qrGenerator.CreateQrCode(wifiPayload, QRCodeGenerator.ECCLevel.Q);
            using var qrCode = new PngByteQRCode(qrCodeData);
            byte[] qrCodeBytes = qrCode.GetGraphic(20); // 20 pixels per module

            return await Task.FromResult(qrCodeBytes); // Return byte[] directly
        }

        public byte[] GenerateWifiQRCode(string ssid, string password, int pixelsPerModule = 20)
        {
            if (string.IsNullOrWhiteSpace(ssid))
                throw new ArgumentException("SSID cannot be empty.");
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("Password cannot be empty.");

            string wifiPayload = $"WIFI:S:{EscapeSpecialCharacters(ssid)};T:WPA;P:{EscapeSpecialCharacters(password)};;";

            using var qrGenerator = new QRCodeGenerator();
            var qrCodeData = qrGenerator.CreateQrCode(wifiPayload, QRCodeGenerator.ECCLevel.Q);
            using var qrCode = new PngByteQRCode(qrCodeData);
            return qrCode.GetGraphic(pixelsPerModule);
        }

        private string EscapeSpecialCharacters(string input)
        {
            var escaped = new StringBuilder();
            foreach (char c in input)
            {
                if (c == ';' || c == ',' || c == ':' || c == '\\')
                    escaped.Append('\\');
                escaped.Append(c);
            }
            return escaped.ToString();
        }
    }
}