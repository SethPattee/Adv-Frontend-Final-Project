

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
            ValidateAudience = false 
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

app.MapGet("/authonly", () =>
{
    Console.WriteLine("Used AuthOnly");
    return "Hello Authenticated World!";
}).RequireAuthorization();

app.Run();


//   <ItemGroup>
//     <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.10" />
//     <PackageReference Include="Microsoft.IdentityModel" Version="7.0.0" />
//   </ItemGroup>
