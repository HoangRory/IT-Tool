
using System.Reflection;
namespace Backend.Services
{
    public class ToolsManager
    {
        private readonly Dictionary<string, ITool> _tools = new();

        public void LoadTools()
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
                }
            }
        }

        public void AddTool(ITool tool)
        {
            _tools[tool.Path] = tool;
        }

        public void RemoveTool(string path)
        {
            _tools.Remove(path);
        }

        public ITool GetTool(string path) => _tools.GetValueOrDefault(path);

        public IEnumerable<ITool> GetAllTools() => _tools.Values;
    }
}

