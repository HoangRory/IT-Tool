using Microsoft.EntityFrameworkCore;

namespace Backend.Models // Adjust namespace to match your project
{
    public class ToolService
    {
        private readonly DbIttoolContext _context;

        // Constructor with dependency injection for DbContext
        public ToolService(DbIttoolContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // Fetches all tools asynchronously
        public async Task<List<Tool>> GetAllToolsAsync()
        {
            return await _context.Tools
                .AsNoTracking()
                .ToListAsync();
        }

        // Fetches a tool by ID asynchronously
        public async Task<Tool?> GetToolByIdAsync(int id)
        {
            return await _context.Tools
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
        }
    }
}