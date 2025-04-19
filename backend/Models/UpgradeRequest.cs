using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class UpgradeRequest
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public DateTime TimeCreated { get; set; }

    public string Status { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
