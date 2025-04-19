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
    }
}