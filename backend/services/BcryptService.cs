using BCrypt.Net;

namespace Backend.Services
{
    class BcryptTool : ITool
    {
        public string Name => "Bcrypt Tool";
        public string Path => "/api/tools/bcrypt";
        public string Category => "Crypto";
        public string Description => "Perform bcrypt hash or compare operations.";

        public async Task<object> ExecuteAsync(Dictionary<string, object> parameters)
        {
            if (!parameters.TryGetValue("mode", out var modeObj))
                throw new ArgumentException("Missing 'mode' parameter. Use 'hash' or 'compare'.");

            string mode = modeObj.ToString()?.ToLower() ?? "";

            if (!parameters.TryGetValue("input", out var inputObj))
                throw new ArgumentException("Missing 'input' parameter.");

            string text = inputObj.ToString() ?? string.Empty;

            if (mode == "hash")
            {
                if (!parameters.TryGetValue("saltRounds", out var saltObj))
                    throw new ArgumentException("Missing 'saltRounds' parameter for hash mode.");

                int saltRounds = int.Parse(saltObj.ToString() ?? string.Empty);
                string hash = BCrypt.Net.BCrypt.HashPassword(text, saltRounds);

                var hashResult = new Dictionary<string, object>
                {
                    ["Hash"] = hash,
                    ["SaltRounds"] = saltRounds
                };

                return await Task.FromResult(hashResult);
            }
            else if (mode == "compare")
            {
                if (!parameters.TryGetValue("hash", out var hashObj))
                    throw new ArgumentException("Missing 'hash' parameter for compare mode.");

                string hash = hashObj.ToString() ?? string.Empty;
                bool match = BCrypt.Net.BCrypt.Verify(text, hash);

                var compareResult = new Dictionary<string, object>
                {
                    ["Match"] = match
                };

                return await Task.FromResult(compareResult);
            }
            else
            {
                throw new ArgumentException("Invalid mode. Use 'hash' or 'compare'.");
            }
        }
    }
}
