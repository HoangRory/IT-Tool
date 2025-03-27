using Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddSingleton<WifiQRCodeService>();
// Enable CORS to allow React frontend to call the API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React default port
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure middleware
app.UseHttpsRedirection();
app.UseCors("AllowReact"); // Apply CORS policy
app.UseAuthorization();
app.MapControllers();

app.Run();