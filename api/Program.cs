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
using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder.AllowAnyOrigin() 
               .AllowAnyMethod() 
               .AllowAnyHeader();
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
app.UseCors("AllowAllOrigins");
app.UseCors("AccessControlAllowOrigin");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

var inventoryItems = new Dictionary<string, InventoryItem>();
const string FILE_PATH = "data/inventory.json";
const string IMAGE_DIRECTORY = "data/images";
const string DEFAULT_IMAGE = "default_image.jpg";

// Define endpoints

// GET /api/profile - Retrieve authenticated user's profile
// app.MapGet("/api/profile", async (ClaimsPrincipal user, AppDbContext dbContext) =>
// {
//     var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//     if (userIdClaim == null) return Results.Unauthorized();

//     var profile = await dbContext.Profiles
//         .FirstOrDefaultAsync(p => p.UserId == int.Parse(userIdClaim));

//     if (profile == null) return Results.NotFound("Profile not found");

//     return Results.Ok(profile);
// }).RequireAuthorization();

// PUT /api/profile - Update authenticated user's profile
// app.MapPut("/api/profile", async (ClaimsPrincipal user, [FromBody] ProfileUpdateDto profileUpdate, AppDbContext dbContext) =>
// {
//     var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//     if (userIdClaim == null) return Results.Unauthorized();

//     var profile = await dbContext.Profiles
//         .FirstOrDefaultAsync(p => p.UserId == int.Parse(userIdClaim));

//     if (profile == null) return Results.NotFound("Profile not found");

//     // Update profile fields
//     if (profileUpdate.Bio != null) profile.Bio = profileUpdate.Bio;
//     if (profileUpdate.AvatarUrl != null) profile.AvatarUrl = profileUpdate.AvatarUrl;

//     dbContext.Profiles.Update(profile);
//     await dbContext.SaveChangesAsync();

//     return Results.Ok(profile);
// }).RequireAuthorization();
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

// GET /api/blog - List all blog posts
// app.MapGet("/api/blog", async (AppDbContext dbContext) =>
// {
//     var blog_posts = await dbContext.blog_posts.ToListAsync();
//     return Results.Ok(blog_posts);
// });

// // POST /api/blog - Submit a new blog post
// app.MapPost("/api/blog", async (ClaimsPrincipal user, [FromBody] BlogPost newPost, AppDbContext dbContext) =>
// {
//     var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//     if (userIdClaim == null) return Results.Unauthorized();

//     newPost.UserId = int.Parse(userIdClaim);
//     newPost.CreatedAt = DateTime.Now;
//     newPost.UpdatedAt = DateTime.Now;

//     dbContext.blog_posts.Add(newPost);
//     await dbContext.SaveChangesAsync();

//     return Results.Ok(newPost);
// }).RequireAuthorization();


if (!Directory.Exists(IMAGE_DIRECTORY))
{
    Directory.CreateDirectory(IMAGE_DIRECTORY);
}

// Copy default image if it doesn't exist
string defaultImagePath = Path.Combine(IMAGE_DIRECTORY, DEFAULT_IMAGE);
if (!File.Exists(defaultImagePath))
{
    File.Copy(Path.Combine("./", DEFAULT_IMAGE), defaultImagePath);
}

if (File.Exists(FILE_PATH))
{
    var json = File.ReadAllText(FILE_PATH);
    inventoryItems = JsonSerializer.Deserialize<Dictionary<string, InventoryItem>>(json);
}

if (inventoryItems.Count == 0)
{
    SeedInventory();
}

void SeedInventory()
{
    var seedItems = new List<InventoryItem>
    {
        new InventoryItem { Id = Guid.NewGuid().ToString(), Title = "The Great Gatsby", Author = "F. Scott Fitzgerald", Description = "A classic novel about the American Dream", ImagePath = DEFAULT_IMAGE },
        new InventoryItem { Id = Guid.NewGuid().ToString(), Title = "To Kill a Mockingbird", Author = "Harper Lee", Description = "A powerful story of racial injustice and loss of innocence", ImagePath = DEFAULT_IMAGE },
        new InventoryItem { Id = Guid.NewGuid().ToString(), Title = "1984", Author = "George Orwell", Description = "A dystopian novel about totalitarian control", ImagePath = DEFAULT_IMAGE },
        new InventoryItem { Id = Guid.NewGuid().ToString(), Title = "Pride and Prejudice", Author = "Jane Austen", Description = "A romantic novel of manners", ImagePath = DEFAULT_IMAGE },
        new InventoryItem { Id = Guid.NewGuid().ToString(), Title = "The Catcher in the Rye", Author = "J.D. Salinger", Description = "A coming-of-age story of teenage angst and alienation", ImagePath = DEFAULT_IMAGE }
    };

    foreach (var item in seedItems)
    {
        inventoryItems[item.Id] = item;
    }

    SaveData();
}

void SaveData()
{
    try
    {
        var json = JsonSerializer.Serialize(inventoryItems);
        File.WriteAllText(FILE_PATH, json);
        Console.WriteLine("Data saved successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error saving data: {ex.Message}");
    }
}

app.UseStaticFiles(new StaticFileOptions
{
    // FileProvider = new PhysicalFileProvider(IMAGE_DIRECTORY),
    FileProvider = new PhysicalFileProvider(Path.GetFullPath(IMAGE_DIRECTORY)),
    RequestPath = "/images"
});



// Create
app.MapPost("/inventory", async (HttpContext context) =>
{
    var form = await context.Request.ReadFormAsync();
    Console.WriteLine($"Received form: {form}");
    var item = new InventoryItem
    {
        Id = Guid.NewGuid().ToString(),
        Title = form["title"],
        Author = form["author"],
        Description = form["description"],
        ImagePath = "default_book.jpg"
    };


    var file = form.Files.GetFile("image");
    Console.WriteLine($"Received file: {file}");
    if (file != null && file.Length > 0)
    {
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (fileExtension != ".jpg" && fileExtension != ".png")
        {
            return Results.BadRequest("Only .jpg and .png files are allowed.");
        }

        var fileName = $"{item.Id}{fileExtension}";
        var filePath = Path.Combine(IMAGE_DIRECTORY, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        item.ImagePath = fileName;
        Console.WriteLine($"Image saved: {fileName}");
    }

    inventoryItems[item.Id] = item;
    SaveData();
    return Results.Created($"/inventory/{item.Id}", item);
});

// Read
app.MapGet("/inventory/{id}", (string id) =>
{
    if (inventoryItems.TryGetValue(id, out var item))
    {
        Console.WriteLine("Retrueved item: " + item);
        return Results.Ok(item);
    }
    Console.WriteLine("Item not found: " + id);
    return Results.NotFound($"Item with ID {id} not found.");
});


app.MapPut("/inventory/{id}", async (string id, HttpContext context) =>
{
    if (!inventoryItems.ContainsKey(id))
    {
        return Results.NotFound($"Item with ID {id} not found.");
    }

    var form = await context.Request.ReadFormAsync();
    var item = inventoryItems[id];
    item.Title = form["title"];
    item.Author = form["author"];
    item.Description = form["description"];

    var file = form.Files.GetFile("image");
    if (file != null && file.Length > 0)
    {
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (fileExtension != ".jpg" && fileExtension != ".png")
        {
            return Results.BadRequest("Only .jpg and .png files are allowed.");
        }

        var fileName = $"{item.Id}{fileExtension}";
        var filePath = Path.Combine(IMAGE_DIRECTORY, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Delete the old image if it's not the default
        if (item.ImagePath != "default_book.jpg")
        {
            var oldFilePath = Path.Combine(IMAGE_DIRECTORY, item.ImagePath);
            if (File.Exists(oldFilePath))
            {
                File.Delete(oldFilePath);
            }
        }

        item.ImagePath = fileName;
    }

    SaveData();
    return Results.Ok(item);
});

// Delete
app.MapDelete("/inventory/{id}", (string id) =>
{
    if (inventoryItems.Remove(id))
    {
        Console.WriteLine($"Item with ID {id} deleted.");
        SaveData();
        return Results.Ok($"Item with ID {id} deleted.");
    }
    Console.WriteLine($"Item with ID {id} not found.");
    return Results.NotFound($"Item with ID {id} not found.");
});

app.MapDelete("/inventory", () =>
{
    inventoryItems.Clear(); 
    return Results.NoContent();
});

app.MapGet("/inventory", () => {
    return inventoryItems.Values.ToList();
});

app.Run();


public class InventoryItem
{
    public string Id { get; set; }
    public string Title { get; set; }
    public string? Author { get; set; }
    public string? Description { get; set; }
    public string? ImagePath { get; set; }
}
//

// DTO for updating profile
public record ProfileUpdateDto(string? Bio, string? AvatarUrl);

// Database context and models
public class BlogPost
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Profile> Profiles { get; set; }
    public DbSet<BlogPost> blog_posts { get; set; }
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
