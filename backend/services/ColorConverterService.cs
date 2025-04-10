using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Wacton.Unicolour;
using Wacton.Unicolour.Icc;

namespace Backend.Services
{
    public class ColorConverterService : ITool
    {
        private static readonly Dictionary<string, string> CssColorNames = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            {"black", "#000000"}, {"white", "#ffffff"}, {"red", "#ff0000"}, {"lime", "#00ff00"},
            {"blue", "#0000ff"}, {"yellow", "#ffff00"}, {"fuchsia", "#ff00ff"}, {"aqua", "#00ffff"},
            {"gray", "#808080"}
        };

        public string Name => "Color Converter";
        public string Path => "/api/tools/color-converter";
        public string Category => "Converter";
        public string Description => "Convert a color code to various formats (hex, rgb, hsl, hwb, lch, cmyk, css)";

        public async Task<object> ExecuteAsync(Dictionary<string, object> parameters)
        {
            if (!parameters.TryGetValue("Color", out var colorObj) || !parameters.TryGetValue("Format", out var formatObj))
                throw new ArgumentException("Color and Format are required.");

            string color = colorObj?.ToString()?.Trim();
            string format = formatObj?.ToString()?.ToLower();
            if (string.IsNullOrEmpty(color) || string.IsNullOrEmpty(format))
                throw new ArgumentException("Color and Format cannot be empty");

            Unicolour unicolour = ParseColorToUnicolour(color, format);
            string hex = GetHexWithAlpha(unicolour);
            Console.WriteLine($"HEX:{hex}");
            string cssName = GetCssName(hex.Substring(0, 7)) ?? "none";

            var result = new Dictionary<string, object>
            {
                ["hex"] = hex,
                ["rgb"] = FormatRgb(unicolour, unicolour.Rgb),
                ["hsl"] = FormatHsl(unicolour, unicolour.Hsl),
                ["hwb"] = FormatHwb(unicolour, unicolour.Hwb),
                ["lch"] = FormatLch(unicolour, unicolour.Lchab), // Using CIELChab as LCH
                ["cmyk"] = FormatCmyk(unicolour,unicolour.Icc), // Fixed to handle Channels correctly
                ["css"] = cssName
            };

            return await Task.FromResult(result);
        }

        private Unicolour ParseColorToUnicolour(string color, string format)
        {
            switch (format)
            {
                case "hex":
                    // Console.WriteLine($"HEX:{color}");
                    if (!Regex.IsMatch(color, @"^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$"))
                        throw new ArgumentException("Invalid HEX color");
                    return new Unicolour(color);

                case "rgb":
                    var rgbMatch = Regex.Match(color, @"rgb\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-1]?\.?\d*))?\)");
                    if (!rgbMatch.Success) throw new ArgumentException("Invalid RGB format");
                    int r = Math.Clamp(int.Parse(rgbMatch.Groups[1].Value), 0, 255);
                    int g = Math.Clamp(int.Parse(rgbMatch.Groups[2].Value), 0, 255);
                    int b = Math.Clamp(int.Parse(rgbMatch.Groups[3].Value), 0, 255);
                    double a = rgbMatch.Groups[4].Success ? Math.Clamp(double.Parse(rgbMatch.Groups[4].Value), 0, 1) : 1.0;
                    Console.WriteLine((r, g, b, a));
                    return new Unicolour(ColourSpace.Rgb255, r, g, b, a);

                case "hsl":
                    var hslMatch = Regex.Match(color, @"hsl\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([0-1]?\.?\d*))?\)");
                    if (!hslMatch.Success) throw new ArgumentException("Invalid HSL format");
                    double h = double.Parse(hslMatch.Groups[1].Value) % 360;
                    double s = Math.Clamp(double.Parse(hslMatch.Groups[2].Value) / 100.0, 0, 1);
                    double l = Math.Clamp(double.Parse(hslMatch.Groups[3].Value) / 100.0, 0, 1);
                    a = hslMatch.Groups[4].Success ? Math.Clamp(double.Parse(hslMatch.Groups[4].Value), 0, 1) : 1.0;
                    Console.WriteLine((h, s, l, a));
                    return new Unicolour(ColourSpace.Hsl, h, s, l, a);

                case "hwb":
                    var hwbMatch = Regex.Match(color, @"hwb\((\d+)\s+(\d+)%\s+(\d+)%(?:,\s*([0-1]?\.?\d*))?\)");
                    if (!hwbMatch.Success) throw new ArgumentException("Invalid HWB format");
                    h = double.Parse(hwbMatch.Groups[1].Value) % 360;
                    double w = Math.Clamp(double.Parse(hwbMatch.Groups[2].Value) / 100.0, 0, 1);
                    double bk = Math.Clamp(double.Parse(hwbMatch.Groups[3].Value) / 100.0, 0, 1);
                    a = hwbMatch.Groups[4].Success ? Math.Clamp(double.Parse(hwbMatch.Groups[4].Value), 0, 1) : 1.0;
                    Console.WriteLine((h, w, bk, a));
                    return new Unicolour(ColourSpace.Hwb, h, w, bk, a);

                case "lch":
                    var lchMatch = Regex.Match(color, @"lch\((\d+)%\s+(\d+)\s+(\d+)(?:,\s*([0-1]?\.?\d*))?\)");
                    if (!lchMatch.Success) throw new ArgumentException("Invalid LCH format");
                    double lc = Math.Clamp(double.Parse(lchMatch.Groups[1].Value), 0, 100);
                    double c = Math.Max(double.Parse(lchMatch.Groups[2].Value), 0); // Chroma can exceed typical bounds
                    h = double.Parse(lchMatch.Groups[3].Value) % 360;
                    a = lchMatch.Groups[4].Success ? Math.Clamp(double.Parse(lchMatch.Groups[4].Value), 0, 1) : 1.0;
                    Console.WriteLine((lc, c, h, a));
                    return new Unicolour(ColourSpace.Lchab, lc, c, h, a);

                case "cmyk":
                    var cmykMatch = Regex.Match(color, @"cmyk\((\d+)%,\s*(\d+)%,\s*(\d+)%,\s*(\d+)%(?:,\s*([0-1]?\.?\d*))?\)");
                    if (!cmykMatch.Success) throw new ArgumentException("Invalid CMYK format");
                    double cm = Math.Clamp(double.Parse(cmykMatch.Groups[1].Value) / 100.0, 0, 1);
                    double m = Math.Clamp(double.Parse(cmykMatch.Groups[2].Value) / 100.0, 0, 1);
                    double y = Math.Clamp(double.Parse(cmykMatch.Groups[3].Value) / 100.0, 0, 1);
                    double k = Math.Clamp(double.Parse(cmykMatch.Groups[4].Value) / 100.0, 0, 1);
                    a = cmykMatch.Groups[5].Success ? Math.Clamp(double.Parse(cmykMatch.Groups[5].Value), 0, 1) : 1.0;
                    var channels = new Channels(cm, m, y, k);
                    Console.WriteLine((channels, a));
                    return new Unicolour(channels, a);

                case "css":
                    var cssColor = color.ToLower();
                    if (CssColorNames.ContainsKey(cssColor))
                        return new Unicolour(CssColorNames[cssColor]);
                    throw new ArgumentException("Unknown CSS color name");

                default:
                    throw new ArgumentException("Unsupported color format");
            }
        }

        private string GetHexWithAlpha(Unicolour unicolour)
        {
            var (r, g, b) = unicolour.Rgb.Byte255.Triplet;
            string rgbHex = $"{r:X2}{g:X2}{b:X2}";
            string alphaHex = unicolour.Alpha.A < 1 
                ? $"{(int)(unicolour.Alpha.A * 255):X2}" 
                : "FF";
            return $"#{rgbHex}{alphaHex}";
        }

        private string FormatRgb(Unicolour unicolour, Rgb rgb)
        {
            var (r, g, b) = rgb.Byte255.Triplet;
            Console.WriteLine($"RGB:{(r, g, b)}");
            return unicolour.Alpha.A < 1
                ? $"rgb({r}, {g}, {b}, {unicolour.Alpha.A:F2})"
                : $"rgb({r}, {g}, {b})";
        }

        private string FormatHsl(Unicolour unicolour, Hsl hsl)
        {
            var (h, s, l) = hsl.Triplet;
            Console.WriteLine($"hsl:{(h,s,l)}");
            return unicolour.Alpha.A < 1
                ? $"hsl({h:F0}, {s * 100:F0}%, {l * 100:F0}%, {unicolour.Alpha.A:F2})"
                : $"hsl({h:F0}, {s * 100:F0}%, {l * 100:F0}%)";
        }

        private string FormatHwb(Unicolour unicolour, Hwb hwb)
        {
            var (h, w, b) = hwb.Triplet;
            Console.WriteLine($"hwb:{(h, w, b)}");
            return unicolour.Alpha.A < 1
                ? $"hwb({h:F0} {w * 100:F0}% {b * 100:F0}%, {unicolour.Alpha.A:F2})"
                : $"hwb({h:F0} {w * 100:F0}% {b * 100:F0}%)";
        }

        private string FormatLch(Unicolour unicolour, Lchab lch)
        {
            var (l, c, h) = lch.Triplet;
            Console.WriteLine($"lch:{(l, c, h)}");
            return unicolour.Alpha.A < 1
                ? $"lch({l:F0}% {c:F0} {h:F0}, {unicolour.Alpha.A:F2})"
                : $"lch({l:F0}% {c:F0} {h:F0})";
        }

        private string FormatCmyk(Unicolour unicolour, Channels icc)
        {
            // Ensure we have at least 4 channels for CMYK
            double c = icc.Values.Length > 0 ? icc.Values[0] : 0;
            double m = icc.Values.Length > 1 ? icc.Values[1] : 0;
            double y = icc.Values.Length > 2 ? icc.Values[2] : 0;
            double k = icc.Values.Length > 3 ? icc.Values[3] : 0;
            double a = unicolour.Alpha.A; // Access alpha from Channels
            Console.WriteLine($"cmyk:{(c, m, y, k)}");
            return a < 1
                ? $"cmyk({c * 100:F0}%, {m * 100:F0}%, {y * 100:F0}%, {k * 100:F0}%, {a:F2})"
                : $"cmyk({c * 100:F0}%, {m * 100:F0}%, {y * 100:F0}%, {k * 100:F0}%)";
        }

        private string GetCssName(string hex)
        {
            return CssColorNames.TryGetValue(hex, out var name) ? name : null;
        }
    }
}