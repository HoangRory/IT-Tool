using Microsoft.EntityFrameworkCore;

namespace Backend.Models // Adjust namespace to match your project
{
    public class ToolService
    {
        private readonly DefaultdbContext _context;

        // Constructor with dependency injection for DbContext
        public ToolService(DefaultdbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // Fetches all tools asynchronously
        public async Task<List<Tool>> GetAllToolsAsync()
        {
            return await _context.Tools
                .AsNoTracking()
                .Include(t => t.Category)
                .ToListAsync();
        }

        // Fetches a tool by ID asynchronously
        public async Task<Tool?> GetToolByIdAsync(int id)
        {
            return await _context.Tools
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Tool?> GetToolByPathAsync(string path)
        {
            return await _context.Tools
                .AsNoTracking()
                .Include(t => t.Category)
                .FirstOrDefaultAsync(t => t.Path == path);
        }

        public async Task<object> GetToolByPathWithFavoriteAsync(string path, int? userId)
        {
            var tool = await _context.Tools
                .AsNoTracking()
                .Where(t => t.Path == path && t.IsEnabled == true)
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.Description,
                    t.IsPremium,
                    IsFavorite = userId != null && t.Users.Any(u => u.Id == userId.Value)
                })
                .FirstOrDefaultAsync();
            return tool;
        }

        public async Task<List<object>> GetFavoritesAsync(int userId)
        {
            return await _context.Users
                .AsNoTracking()
                .Where(u => u.Id == userId)
                .SelectMany(u => u.Tools)
                .Where(t => t.IsEnabled == true)
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.Description,
                    t.Path,
                    t.IsPremium
                })
                .ToListAsync<object>();
        }

        public async Task<bool> ToggleFavoriteAsync(int userId, int toolId)
        {
            var user = await _context.Users
                .Include(u => u.Tools)
                .FirstOrDefaultAsync(u => u.Id == userId);
            var tool = await _context.Tools.FindAsync(toolId);

            if (user == null || tool == null)
            {
                return false;
            }

            if (user.Tools.Contains(tool))
            {
                user.Tools.Remove(tool);
            }
            else
            {
                user.Tools.Add(tool);
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}