using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSingleton<ToolManager>(sp =>
{
    var manager = new ToolManager("plugins"); // Loads existing DLLs here
    return manager;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// File watcher for plugins folder
var toolManager = app.Services.GetRequiredService<ToolManager>();
var watcher = new FileSystemWatcher
{
    Path = Path.GetFullPath("plugins"),
    Filter = "*.dll",
    EnableRaisingEvents = true
};
Console.WriteLine($"FileSystemWatcher is watching: {watcher.Path}");

// Load new DLLs
watcher.Created += (s, e) =>
{
    Console.WriteLine($"Detected new plugin: {e.FullPath}");
    toolManager.LoadNewPlugins(e.FullPath); // Only load new DLLs
};

// Detect DLL removals
watcher.Deleted += (s, e) =>
{
    Console.WriteLine($"Detected plugin removal: {e.FullPath}");
    toolManager.UnloadPlugin(e.FullPath);
};

app.UseCors("AllowReact");
app.UseAuthorization();
app.MapControllers();

// Optional: Manual reload endpoint (reloads all, ignoring duplicates)
app.MapPost("/api/tools/reload-plugins", ([FromServices] ToolManager manager) =>
{
    var dllFiles = Directory.GetFiles(Path.GetFullPath("plugins"), "*.dll");
    foreach (var dll in dllFiles)
    {
        manager.LoadNewPlugins(dll);
    }
    return Results.Ok("Plugins reloaded.");
});

app.Run();