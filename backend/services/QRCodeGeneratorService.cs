using QRCoder;

namespace Backend.Services
{
    public class QRCodeGeneratorService : ITool
    {
        public string Name => "QR Code Generator";
        public string Path => "/api/tools/qr-code-generator";
        public string Category => "Images & Videos";
        public string Description => "Generate and download a QR code for a URL or text with customizable colors and error correction.";

        public async Task<object> ExecuteAsync(Dictionary<string, object> parameters)
        {
            // Extract and validate parameters
            if (!parameters.TryGetValue("Text", out var textObj) || string.IsNullOrWhiteSpace(textObj?.ToString()))
                throw new ArgumentException("Text is required.");

            string text = textObj.ToString();
            string bgColor = parameters.TryGetValue("BackgroundColor", out var bgColorObj) ? bgColorObj.ToString() : "#FFFFFF"; // Default white
            string fgColor = parameters.TryGetValue("ForegroundColor", out var fgColorObj) ? fgColorObj.ToString() : "#000000"; // Default black
            string errorLevel = parameters.TryGetValue("ErrorResistance", out var errorObj) ? errorObj.ToString().ToLower() : "medium";

            // Map error resistance to QRCodeGenerator.ECCLevel
            QRCodeGenerator.ECCLevel eccLevel = errorLevel switch
            {
                "low" => QRCodeGenerator.ECCLevel.L,
                "medium" => QRCodeGenerator.ECCLevel.M,
                "quartile" => QRCodeGenerator.ECCLevel.Q,
                "high" => QRCodeGenerator.ECCLevel.H,
                _ => QRCodeGenerator.ECCLevel.M // Default to medium
            };

            // Generate QR code
            using var qrGenerator = new QRCodeGenerator();
            var qrCodeData = qrGenerator.CreateQrCode(text, eccLevel);
            using var qrCode = new PngByteQRCode(qrCodeData);

            // Convert hex colors to byte arrays (RGB)
            var bgColorRgb = HexToRgb(bgColor);
            var fgColorRgb = HexToRgb(fgColor);

            // Generate PNG byte array with custom colors
            byte[] qrCodeImage = qrCode.GetGraphic(20, fgColorRgb, bgColorRgb);

            // // Convert to base64 string
            // string base64Image = Convert.ToBase64String(qrCodeImage);
            Console.WriteLine("Generating QR Code");
            // Return only the base64 string
            return await Task.FromResult(qrCodeImage);
        }

        // Helper method to convert hex color to RGB byte array
        private byte[] HexToRgb(string hex)
        {
            hex = hex.TrimStart('#');
            if (hex.Length != 6)
                return new byte[] { 0, 0, 0 }; // Default to black/white if invalid

            return new byte[]
            {
                Convert.ToByte(hex.Substring(0, 2), 16), // R
                Convert.ToByte(hex.Substring(2, 2), 16), // G
                Convert.ToByte(hex.Substring(4, 2), 16)  // B
            };
        }
    }
}