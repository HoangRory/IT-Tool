using System.Reflection;
using System.IO;
using System.Collections.Generic;

namespace Backend.Services
{
    public class ToolManager
    {
        private readonly Dictionary<string, ITool> _tools = new();
        private readonly string _pluginsPath;
        private readonly HashSet<string> _loadedDlls = new(); // Track loaded DLLs by path

        public ToolManager(string pluginsPath = "plugins")
        {
            _pluginsPath = Path.GetFullPath(pluginsPath);
            Directory.CreateDirectory(_pluginsPath);
            LoadInitialTools(); // Load built-in tools
            LoadExistingPlugins(); // Load existing DLLs at startup
        }

        // Load tools from the main assembly
        private void LoadInitialTools()
        {
            var toolTypes = Assembly.GetExecutingAssembly()
                .GetTypes()
                .Where(t => typeof(ITool).IsAssignableFrom(t) && !t.IsInterface);
            foreach (var type in toolTypes)
            {
                var tool = Activator.CreateInstance(type) as ITool;
                if (tool != null)
                {
                    _tools[tool.Path] = tool;
                    Console.WriteLine($"Loaded initial tool: {tool.Name}");
                }
            }
        }

        // Load existing plugins at startup
        private void LoadExistingPlugins()
        {
            var dllFiles = Directory.GetFiles(_pluginsPath, "*.dll", SearchOption.TopDirectoryOnly);
            foreach (var dll in dllFiles)
            {
                LoadPlugin(dll);
                _loadedDlls.Add(dll); // Track as loaded
            }
        }

        // Load new plugins while running
        public void LoadNewPlugins(string newDllPath)
        {
            if (!_loadedDlls.Contains(newDllPath))
            {
                LoadPlugin(newDllPath);
                _loadedDlls.Add(newDllPath);
            }
            else
            {
                Console.WriteLine($"DLL already loaded: {newDllPath}");
            }
        }

        // Core loading logic
        private void LoadPlugin(string dllPath)
        {
            try
            {
                var assembly = Assembly.LoadFrom(dllPath);
                var toolTypes = assembly.GetTypes()
                    .Where(t => typeof(ITool).IsAssignableFrom(t) && !t.IsInterface);
                foreach (var type in toolTypes)
                {
                    var tool = Activator.CreateInstance(type) as ITool;
                    if (tool != null && !_tools.ContainsKey(tool.Path))
                    {
                        _tools[tool.Path] = tool;
                        Console.WriteLine($"Loaded tool: {tool.Name} from {dllPath}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to load plugin {dllPath}: {ex.Message}");
            }
        }

        // Unload tools from a deleted DLL
        public void UnloadPlugin(string dllPath)
        {
            if (_loadedDlls.Contains(dllPath))
            {
                var assembly = Assembly.LoadFrom(dllPath); // Load to check types (might need caching)
                var toolsToRemove = _tools
                    .Where(t => t.Value.GetType().Assembly.Location == dllPath)
                    .Select(t => t.Key)
                    .ToList();
                foreach (var path in toolsToRemove)
                {
                    _tools.Remove(path);
                    Console.WriteLine($"Unloaded tool at path: {path} from {dllPath}");
                }
                _loadedDlls.Remove(dllPath);
            }
        }

        public void AddTool(ITool tool) => _tools[tool.Path] = tool;
        public void RemoveTool(string path) => _tools.Remove(path);
        public ITool GetTool(string path) => _tools.GetValueOrDefault(path);
        public IEnumerable<ITool> GetAllTools() => _tools.Values;
    }
}