# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app
COPY ./*.csproj ./
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o out
EXPOSE 8080

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
# Add this line in the build stage
COPY default_image.jpg ./

# Adjust runtime stage if needed
COPY default_image.jpg /app/
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "api.dll"]
