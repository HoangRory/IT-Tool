﻿using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Tool> Tools { get; set; } = new List<Tool>();
}
