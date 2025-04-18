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

        /// <summary>
        /// Validates user credentials and returns the user if authenticated.
        /// </summary>
        /// <param name="username">The username to validate.</param>
        /// <param name="password">The password to validate.</param>
        /// <returns>The User object if credentials are valid; otherwise, null.</returns>
        public async Task<User?> ValidateUserAsync(string username, string password)
        {
            // Find user by username (case-insensitive)
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());

            // If user exists and password is valid, return the user
            if (user != null && VerifyPassword(password, user.PasswordHash))
            {
                return user;
            }

            return null;
        }

        /// <summary>
        /// Verifies a password against its hash.
        /// </summary>
        /// <param name="password">The plain-text password.</param>
        /// <param name="passwordHash">The hashed password.</param>
        /// <returns>True if the password is valid; otherwise, false.</returns>
        private bool VerifyPassword(string password, string passwordHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, passwordHash);
        }

        /// <summary>
        /// Hashes a password for storage.
        /// </summary>
        /// <param name="password">The plain-text password.</param>
        /// <returns>The hashed password.</returns>
        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}