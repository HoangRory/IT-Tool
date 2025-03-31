using Backend.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NewToolPlugin
{
    public class CoolNewToolService : ITool
    {
        public string Name => "Cool New Tool";
        public string Path => "/api/tools/cool-tool";
        public string Category => "Misc";
        public async Task<object> ExecuteAsync(Dictionary<string, object> parameters)
        {
            return await Task.FromResult(new Dictionary<string, object> { ["Result"] = "Cool!" });
        }
    }
}