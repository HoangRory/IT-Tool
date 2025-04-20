using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Models
{
    public class RequestService
    {
        private readonly DefaultdbContext _context;

        public RequestService(DefaultdbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<List<UpgradeRequest>> GetAllUpgradeRequestsAsync()
        {
            return await _context.UpgradeRequests
                .AsNoTracking()
                .Include(r => r.User)
                .ToListAsync();
        }

        public async Task<bool> UpdateRequestStatusAsync(int requestId, string status, bool updateUserRoleToPremium = false)
        {
            try
            {
                var request = await _context.UpgradeRequests
                    .Include(r => r.User)
                    .FirstOrDefaultAsync(r => r.Id == requestId);

                if (request == null)
                {
                    return false; // Request not found
                }

                request.Status = status;

                if (updateUserRoleToPremium && request.User != null)
                {
                    request.User.Role = "premium";
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> AddPendingUpgradeRequestAsync(string username)
        {
            try
            {
                // Check if user exists
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == username);

                if (user == null)
                {
                    return false; // User not found
                }

                // Check for existing pending or denied request
                var existingRequest = await _context.UpgradeRequests
                    .AnyAsync(r => r.UserId == user.Id && (r.Status == "Pending" || r.Status == "Denied"));

                if (existingRequest)
                {
                    return false; // User already has a pending or denied request
                }

                // Create new pending request
                var newRequest = new UpgradeRequest
                {
                    UserId = user.Id,
                    TimeCreated = DateTime.UtcNow,
                    Status = "Pending"
                };

                _context.UpgradeRequests.Add(newRequest);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<string> GetUserRequestStatusAsync(string username)
        {
            try
            {
                // Find user by username
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == username);

                if (user == null)
                {
                    return "none"; // User not found
                }

                // Check for pending or denied requests
                var request = await _context.UpgradeRequests
                    .Where(r => r.UserId == user.Id && (r.Status == "Pending" || r.Status == "Denied"))
                    .OrderByDescending(r => r.TimeCreated) // Get the most recent request
                    .FirstOrDefaultAsync();

                if (request == null)
                {
                    return "none"; // No pending or denied requests
                }

                return request.Status.ToLower(); // Return "pending" or "denied"
            }
            catch (Exception)
            {
                return "none";
            }
        }
    }
}