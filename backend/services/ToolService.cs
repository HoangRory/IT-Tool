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
    }
}