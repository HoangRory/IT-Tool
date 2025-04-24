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

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users
                .AsNoTracking()
                .Select(u => new User
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role
                })
                .ToListAsync();
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                return null;
            }

            return await _context.Users
                .AsNoTracking()
                .Select(u => new User
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role
                })
                .FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<List<User>> SearchUsersByUsernameAsync(string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                return await GetAllUsersAsync();
            }

            return await _context.Users
                .AsNoTracking()
                .Where(u => u.Username.Contains(searchTerm))
                .Select(u => new User
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role
                })
                .ToListAsync();
        }

        public async Task<bool> UpdateUserRoleAsync(string username, string role)
        {
            if (string.IsNullOrEmpty(username) || !IsValidRole(role))
            {
                return false;
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                return false;
            }

            user.Role = role;
            await _context.SaveChangesAsync();
            return true;
        }

        private bool IsValidRole(string role)
        {
            return role.ToLower() == "user" || role.ToLower() == "premium" || role.ToLower() == "admin";
        }
    }
}