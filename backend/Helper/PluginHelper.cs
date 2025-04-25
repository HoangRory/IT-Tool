using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using Backend.Models;
using System.ComponentModel.DataAnnotations; // nếu PluginUploadModel nằm trong Models

namespace Backend.Helpers
{
    public class PluginUploadModel
    {
        [Required]
        public IFormFile? JsFile { get; set; }

        [Required]
        public IFormFile? InputSchema { get; set; }

        [Required]
        public IFormFile? OutputSchema { get; set; }

        [Required]
        public string? Name { get; set; }

        public string? Description { get; set; }

        public string? Path { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
    public static class PluginHelper
    {
        public static IActionResult ValidatePluginUploadModel(PluginUploadModel model)
        {
            if (model.JsFile == null || model.InputSchema == null || model.OutputSchema == null)
                return new BadRequestObjectResult("All files are required.");

            if (string.IsNullOrEmpty(model.Name) || string.IsNullOrEmpty(model.Path))
                return new BadRequestObjectResult("Name and Path are required.");

            if (model.CategoryId <= 0)
                return new BadRequestObjectResult("CategoryId is required.");

            return null;
        }

        public static async Task<string> SavePluginFileAsync(IFormFile file, string path)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is required.");
            string safePath = SanitizeFileName(path);
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "tools", safePath + ".js");

            if (File.Exists(filePath))
                throw new IOException("File with the same name already exists.");

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);
            return filePath;
        }

        public static async Task<string> ReadFileContentAsync(IFormFile file)
        {
            using var reader = new StreamReader(file.OpenReadStream());
            return await reader.ReadToEndAsync();
        }

        public static string SanitizeFileName(string input)
        {
            foreach (char c in Path.GetInvalidFileNameChars())
            {
                input = input.Replace(c, '_');
            }
            return input;
        }
        public static bool DeletePluginFileAsync(string path)
        {
            string safePath = SanitizeFileName(path);
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "tools", safePath + ".js");

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                return true;
            }
            return false;
        }
    }
}
