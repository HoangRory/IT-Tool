using Microsoft.EntityFrameworkCore;
using Backend.Models;
using System.Threading.Tasks;
using BCrypt.Net;

namespace Backend.Models
{
    public class AuthService
    {
        private readonly DefaultdbContext _context;

        public AuthService(DefaultdbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<User?> ValidateUserAsync(string username, string password)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());

            if (user != null && VerifyPassword(password, user.PasswordHash))
            {
                return user;
            }

            return null;
        }

        public async Task<bool> RegisterUserAsync(string username, string password)
        {
            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username.ToLower() == username.ToLower()))
            {
                return false; // Username taken
            }

            // Create new user
            var user = new User
            {
                Username = username,
                PasswordHash = HashPassword(password),
                Email = $"{username}@example.com", // Placeholder; update as needed
                Role = "user" // Default role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return true;
        }

        private bool VerifyPassword(string password, string passwordHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, passwordHash);
        }

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}