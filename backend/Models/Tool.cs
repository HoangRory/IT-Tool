using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Tool
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int? CategoryId { get; set; }

    public bool? IsPremium { get; set; }

    public bool? IsEnabled { get; set; }

    public string? InputSchema { get; set; }

    public string? OutputSchema { get; set; }

    public string? Path { get; set; }

    public virtual Category? Category { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
