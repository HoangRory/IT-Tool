using QRCoder;
using System.Drawing;
using System.IO;

namespace Backend.Services
{
    public class WifiQRCodeService
    {
        public byte[] GenerateWifiQRCode(string ssid, string password, int pixelsPerModule = 20)
        {
            if (string.IsNullOrWhiteSpace(ssid))
                throw new ArgumentException("SSID cannot be empty.");
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("Password cannot be empty.");

            string wifiPayload = $"WIFI:S:{EscapeSpecialCharacters(ssid)};T:WPA;P:{EscapeSpecialCharacters(password)};;";

            using (var qrGenerator = new QRCodeGenerator())
            {
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(wifiPayload, QRCodeGenerator.ECCLevel.Q);
                using (var qrCode = new QRCode(qrCodeData))
                {
                    Bitmap qrCodeImage = qrCode.GetGraphic(pixelsPerModule);
                    using (var stream = new MemoryStream())
                    {
                        qrCodeImage.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                        return stream.ToArray();
                    }
                }
            }
        }

        private string EscapeSpecialCharacters(string input)
        {
            var escaped = new System.Text.StringBuilder();
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