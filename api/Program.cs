// using System.Security.Claims;

// var builder = WebApplication.CreateBuilder(args);

// builder.Services.AddCors(options =>
// {
//     options.AddDefaultPolicy(policy =>
//     {
//         policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
//     });
// });

// builder.Services.AddAuthentication("Bearer")
//     .AddJwtBearer("Bearer", options =>
//     {
//         options.Authority = "https://auth.snowse.duckdns.org/realms/advanced-frontend/";
//         options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
//         {
//             ValidateIssuer = true,
//             ValidIssuer = "https://auth.snowse.duckdns.org/realms/advanced-frontend/",
//             ValidateAudience = true,
//             ValidAudience = "seth-authdemo",
//         };
//     });

// builder.Services.AddAuthorization();

// var app = builder.Build();

// app.UseCors();
// app.UseAuthentication();
// app.UseAuthorization();

// app.MapGet("/public", () =>
// {
//     Console.WriteLine("Used Public");
//     return "Hello World!";
// }).AllowAnonymous();

// app.MapGet("/authonly", (ClaimsPrincipal user) =>
// {
//     var email = user.FindFirst(ClaimTypes.Email)?.Value;

//     if (email != null)
//     {
//         Console.WriteLine($"Authenticated user's email: {email}");
//     }
//     else
//     {
//         Console.WriteLine("Email claim not found for authenticated user.");
//     }

//     return "Hello Authenticated World!";
// }).RequireAuthorization();

// app.Run();

using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configure database context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// Configure JWT authentication
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

// Define endpoints

// GET /api/profile - Retrieve authenticated user's profile
app.MapGet("/api/profile", async (ClaimsPrincipal user, AppDbContext dbContext) =>
{
    var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userIdClaim == null) return Results.Unauthorized();

    var profile = await dbContext.Profiles
        .FirstOrDefaultAsync(p => p.UserId == int.Parse(userIdClaim));

    if (profile == null) return Results.NotFound("Profile not found");

    return Results.Ok(profile);
}).RequireAuthorization();

// PUT /api/profile - Update authenticated user's profile
app.MapPut("/api/profile", async (ClaimsPrincipal user, [FromBody] ProfileUpdateDto profileUpdate, AppDbContext dbContext) =>
{
    var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userIdClaim == null) return Results.Unauthorized();

    var profile = await dbContext.Profiles
        .FirstOrDefaultAsync(p => p.UserId == int.Parse(userIdClaim));

    if (profile == null) return Results.NotFound("Profile not found");

    // Update profile fields
    if (profileUpdate.Bio != null) profile.Bio = profileUpdate.Bio;
    if (profileUpdate.AvatarUrl != null) profile.AvatarUrl = profileUpdate.AvatarUrl;

    dbContext.Profiles.Update(profile);
    await dbContext.SaveChangesAsync();

    return Results.Ok(profile);
}).RequireAuthorization();

app.Run();

// DTO for updating profile
public record ProfileUpdateDto(string? Bio, string? AvatarUrl);

// Database context and models
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Profile> Profiles { get; set; }
}

public class Profile
{
    public int Id { get; set; }
    public int UserId { get; set; }  // Corresponds to the authenticated user's ID
    public string Username { get; set; }
    public string AvatarUrl { get; set; }
    public string Bio { get; set; }
    public decimal AstromoneyBalance { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}
