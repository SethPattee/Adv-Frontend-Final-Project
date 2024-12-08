using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.WebSockets;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Concurrent;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
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
app.UseCors("AllowAllOrigins");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseWebSockets();

var connectedClients = new ConcurrentBag<WebSocket>();

app.MapGet("/", () => "WebSocket Server Running!");

app.Use(async (context, next) =>
{
    if (context.Request.Path == "/wss")
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
            Console.WriteLine("WebSocket connected");

            connectedClients.Add(webSocket);
            await HandleWebSocketConnection(webSocket, connectedClients);

            Console.WriteLine("WebSocket disconnected");
        }
        else
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }
    else
    {
        await next();
    }
    if (context.Request.Method == HttpMethods.Options)
    {
        context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
        context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        context.Response.StatusCode = 200;
        await context.Response.CompleteAsync();
    }
    else
    {
        await next();
    }
});



var inventoryItems = new Dictionary<string, InventoryItem>();
const string FILE_PATH = "data/inventory.json";
const string IMAGE_DIRECTORY = "data/images";
const string DEFAULT_IMAGE = "default_image.jpg";
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
        new InventoryItem { Id = Guid.NewGuid().ToString(), Title = "Sticker 1", Author = "1", Description = "It is a Sticker", ImagePath = DEFAULT_IMAGE },
        new InventoryItem { Id = Guid.NewGuid().ToString(), Title = "sticker 2", Author = "12", Description = "It is a Sticker", ImagePath = DEFAULT_IMAGE },
        new InventoryItem { Id = Guid.NewGuid().ToString(), Title = "Sticker 3", Author = "300", Description = "It is a Sticker", ImagePath = DEFAULT_IMAGE },
        new InventoryItem { Id = Guid.NewGuid().ToString(), Title = "Sticker 4", Author = "40", Description = "It is a Sticker", ImagePath = DEFAULT_IMAGE },
        new InventoryItem { Id = Guid.NewGuid().ToString(), Title = "Sticker 5", Author = "6", Description = "It is a Sticker", ImagePath = DEFAULT_IMAGE }
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

app.MapGet("/inventory", () =>
{
    return inventoryItems.Values.ToList();
});

app.Run();




static async Task HandleWebSocketConnection(WebSocket webSocket, ConcurrentBag<WebSocket> clients)
{
    var buffer = new byte[1024 * 4];

    try
    {
        while (webSocket.State == WebSocketState.Open)
        {
            var receiveResult = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            if (receiveResult.MessageType == WebSocketMessageType.Close)
            {
                break;
            }

            string message = Encoding.UTF8.GetString(buffer, 0, receiveResult.Count);
            Console.WriteLine($"Received: {message}");

            foreach (var client in clients)
            {
                if (client != webSocket && client.State == WebSocketState.Open)
                {
                    await client.SendAsync(
                        new ArraySegment<byte>(Encoding.UTF8.GetBytes(message)), 
                        WebSocketMessageType.Text,
                        true,
                        CancellationToken.None);
                }
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }
    finally
    {
        clients.TryTake(out var _);
    if (webSocket.State != WebSocketState.Open)
    {
        clients.TryTake(out _);
    }
    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Connection closed", CancellationToken.None);
    }
}


public class InventoryItem
{
    public string Id { get; set; }
    public string Title { get; set; }
    public string? Author { get; set; }
    public string? Description { get; set; }
    public string? ImagePath { get; set; }
}
//


public class BlogPost
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}

public class Profile
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string AvatarUrl { get; set; }
    public string Bio { get; set; }
    public decimal AstromoneyBalance { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}
