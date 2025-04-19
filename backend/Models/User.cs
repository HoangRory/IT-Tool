using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class User
{
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string? Role { get; set; }

    public virtual ICollection<UpgradeRequest> UpgradeRequests { get; set; } = new List<UpgradeRequest>();

    public virtual ICollection<Tool> Tools { get; set; } = new List<Tool>();
}
