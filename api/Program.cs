

using System;
using System.Collections.Concurrent;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
static void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<WebSocketService>();
}
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
        clients.TryTake(out _);
        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Connection closed", CancellationToken.None);
    }
}


static void Configure(IApplicationBuilder app)
{
    app.UseWebSockets(new WebSocketOptions
    {
        KeepAliveInterval = TimeSpan.FromSeconds(120)
    });

    app.Use(async (context, next) =>
    {
        if (context.Request.Path == "/ws")
        {
            var webSocketService = context.RequestServices.GetRequiredService<WebSocketService>();
            await webSocketService.HandleWebSocketConnection(context);
        }
        else
        {
            await next();
        }
    });
}
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins(
            "https://sethstar.duckdns.org",
            "https://sethapi.duckdns.org"
        )
        .SetIsOriginAllowedToAllowWildcardSubdomains()
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
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
            ValidateLifetime = true
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddSingleton<WebSocketManager>();

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");
app.UseWebSockets(new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromSeconds(120)
});

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
var connectedClients = new ConcurrentBag<WebSocket>();
app.Map("/wss", async (HttpContext context, WebSocketManager webSocketManager) =>
{
    if (context.Request.Headers["Origin"] == "https://sethstar.duckdns.org")
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
            Console.WriteLine("WebSocket connected");
            await webSocketManager.HandleWebSocketConnection(webSocket);
        }
        else
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }
    else
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
    }

    return Task.CompletedTask;
});
app.Use(async (context, next) =>
{
    if (context.Request.Path == "/wss")
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            if (context.Request.Headers["Origin"] == "https://sethstar.duckdns.org")  
            {
                using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                Console.WriteLine("WebSocket connected");

                connectedClients.Add(webSocket);
                await HandleWebSocketConnection(webSocket, connectedClients);

                Console.WriteLine("WebSocket disconnected");
            }
            else
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsync("Origin not allowed");
            }
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
});

app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        Console.WriteLine("Handling CORS Preflight Request");

        context.Response.Headers.Append("Access-Control-Allow-Origin", context.Request.Headers["Origin"]);
        context.Response.Headers.Append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        context.Response.Headers.Append("Access-Control-Allow-Headers", "Content-Type, Authorization");
        context.Response.Headers.Append("Access-Control-Allow-Credentials", "true");

        context.Response.StatusCode = StatusCodes.Status204NoContent;
        await context.Response.CompleteAsync();
        return;
    }

    Console.WriteLine($"Incoming Request: {context.Request.Method} {context.Request.Path}");
    await next();
});

var inventoryItems = new Dictionary<string, InventoryItem>();
const string FILE_PATH = "data/inventory.json";
const string IMAGE_DIRECTORY = "data/images";
const string DEFAULT_IMAGE = "default_image.jpg";

EnsureDirectoriesAndDefaultImage();

LoadOrSeedInventory();


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



void EnsureDirectoriesAndDefaultImage()
{
    try
    {
        Directory.CreateDirectory(IMAGE_DIRECTORY);

        string defaultImagePath = Path.Combine(IMAGE_DIRECTORY, DEFAULT_IMAGE);
        if (!File.Exists(defaultImagePath))
        {
            File.Copy(Path.Combine("./", DEFAULT_IMAGE), defaultImagePath);
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error setting up directories: {ex.Message}");
    }
}

void LoadOrSeedInventory()
{
    try
    {
        if (File.Exists(FILE_PATH))
        {
            var json = File.ReadAllText(FILE_PATH);
            inventoryItems = JsonSerializer.Deserialize<Dictionary<string, InventoryItem>>(json)
                ?? new Dictionary<string, InventoryItem>();
        }

        if (inventoryItems.Count == 0)
        {
            SeedInventory();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error loading inventory: {ex.Message}");
        SeedInventory();
    }
}

void SeedInventory()
{
    var seedItems = new List<InventoryItem>
    {
        new InventoryItem {
            Id = Guid.NewGuid().ToString(),
            Title = "Sticker 1",
            Author = "1",
            Description = "It is a Sticker",
            ImagePath = DEFAULT_IMAGE
        },
    
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
        Directory.CreateDirectory(Path.GetDirectoryName(FILE_PATH));
        File.WriteAllText(FILE_PATH, json);
        Console.WriteLine("Data saved successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error saving data: {ex.Message}");
    }
}

public class WebSocketManager
{
    private readonly ConcurrentBag<WebSocket> _clients = new();

    public async Task HandleWebSocketConnection(WebSocket webSocket)
    {
        _clients.Add(webSocket);
        var buffer = new byte[1024 * 4];

        try
        {
            while (webSocket.State == WebSocketState.Open)
            {
                var receiveResult = await webSocket.ReceiveAsync(
                    new ArraySegment<byte>(buffer),
                    CancellationToken.None
                );

                if (receiveResult.MessageType == WebSocketMessageType.Close)
                {
                    break;
                }

                string message = Encoding.UTF8.GetString(buffer, 0, receiveResult.Count);
                Console.WriteLine($"Received: {message}");

                await BroadcastMessage(message, webSocket);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WebSocket Error: {ex.Message}");
        }
        finally
        {
            _clients.TryTake(out _);
            await CloseWebSocket(webSocket);
        }
    }

    private async Task BroadcastMessage(string message, WebSocket sender)
    {
        var tasks = _clients
            .Where(client => client != sender && client.State == WebSocketState.Open)
            .Select(client => client.SendAsync(
                new ArraySegment<byte>(Encoding.UTF8.GetBytes(message)),
                WebSocketMessageType.Text,
                true,
                CancellationToken.None
            ));

        await Task.WhenAll(tasks);
    }

    private static async Task CloseWebSocket(WebSocket webSocket)
    {
        if (webSocket.State != WebSocketState.Closed)
        {
            await webSocket.CloseAsync(
                WebSocketCloseStatus.NormalClosure,
                "Connection closed",
                CancellationToken.None
            );
        }
    }
}


public class WebSocketService
{
    private readonly ConcurrentDictionary<string, WebSocket> _clients = new();

    public async Task HandleWebSocketConnection(HttpContext context)
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            using WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
            string clientId = Guid.NewGuid().ToString();
            _clients[clientId] = webSocket;

            try
            {
                await HandleClient(clientId, webSocket);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"WebSocket error for client {clientId}: {ex.Message}");
            }
            finally
            {
                _clients.TryRemove(clientId, out _);
                await CloseWebSocket(webSocket);
            }
        }
        else
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }

    private async Task HandleClient(string clientId, WebSocket webSocket)
    {
        var buffer = new byte[1024 * 4];

        while (webSocket.State == WebSocketState.Open)
        {
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(
                new ArraySegment<byte>(buffer),
                CancellationToken.None
            );

            if (result.MessageType == WebSocketMessageType.Close)
            {
                await webSocket.CloseAsync(
                    WebSocketCloseStatus.NormalClosure,
                    "Closing",
                    CancellationToken.None
                );
                break;
            }

            string message = Encoding.UTF8.GetString(buffer, 0, result.Count);
            Console.WriteLine($"Received from {clientId}: {message}");

            await BroadcastMessage(message, clientId);
        }
    }

    private async Task BroadcastMessage(string message, string excludeClientId)
    {
        var tasks = _clients
            .Where(c => c.Key != excludeClientId && c.Value.State == WebSocketState.Open)
            .Select(async client =>
            {
                try
                {
                    await client.Value.SendAsync(
                        new ArraySegment<byte>(Encoding.UTF8.GetBytes(message)),
                        WebSocketMessageType.Text,
                        true,
                        CancellationToken.None
                    );
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending to client {client.Key}: {ex.Message}");
                }
            });

        await Task.WhenAll(tasks);
    }

    private async Task CloseWebSocket(WebSocket webSocket)
    {
        if (webSocket.State != WebSocketState.Closed)
        {
            await webSocket.CloseAsync(
                WebSocketCloseStatus.NormalClosure,
                "Connection closed",
                CancellationToken.None
            );
        }
    }

    public async Task SendMessageToClient(string clientId, string message)
    {
        if (_clients.TryGetValue(clientId, out WebSocket webSocket) &&
            webSocket.State == WebSocketState.Open)
        {
            await webSocket.SendAsync(
                new ArraySegment<byte>(Encoding.UTF8.GetBytes(message)),
                WebSocketMessageType.Text,
                true,
                CancellationToken.None
            );
        }
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