using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.Authority = "https://auth.snowse.duckdns.org/realms/advanced-frontend/";
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "https://auth.snowse.duckdns.org/realms/advanced-frontend/",
            ValidateAudience = true,
            ValidAudience = "seth-authdemo",
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/public", () =>
{
    Console.WriteLine("Used Public");
    return "Hello World!";
}).AllowAnonymous();

app.MapGet("/authonly", (ClaimsPrincipal user) =>
{
    var email = user.FindFirst(ClaimTypes.Email)?.Value;

    if (email != null)
    {
        Console.WriteLine($"Authenticated user's email: {email}");
    }
    else
    {
        Console.WriteLine("Email claim not found for authenticated user.");
    }

    return "Hello Authenticated World!";
}).RequireAuthorization();

app.Run();
