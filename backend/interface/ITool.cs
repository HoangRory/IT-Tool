namespace Backend.Services
{
    public interface ITool 
    {
        string Name { get; }
        string Path { get; }
        string Category { get; }
        string Description {get; }
        Task<object> ExecuteAsync(Dictionary<string, object> parameters);
    }
}