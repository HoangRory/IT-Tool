using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Tool
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Path { get; set; }

    public string? Description { get; set; }

    public string? Parameters { get; set; }
}
