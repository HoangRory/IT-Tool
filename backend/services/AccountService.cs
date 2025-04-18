using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class AccountService
    {
        private readonly DefaultdbContext _context;

        public AccountService(DefaultdbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<int?> GetUserIdByUsernameAsync(string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                return null;
            }

            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Username == username);
            
            return user?.Id;
        }
    }
}