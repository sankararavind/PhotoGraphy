# --- STAGE 1: Build Angular Frontend ---
FROM node:20-alpine AS build-frontend
WORKDIR /app
COPY KuttaPhotography-Frontend/package*.json ./
RUN npm install
COPY KuttaPhotography-Frontend/ ./
RUN npm run build -- --configuration production

# --- STAGE 2: Build .NET Backend ---
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build-backend
WORKDIR /src
COPY ["KuttaPhotography.API/KuttaPhotography.API.csproj", "KuttaPhotography.API/"]
COPY ["KuttaPhotography.Core/KuttaPhotography.Core.csproj", "KuttaPhotography.Core/"]
COPY ["KuttaPhotography.Infrastructure/KuttaPhotography.Infrastructure.csproj", "KuttaPhotography.Infrastructure/"]
RUN dotnet restore "KuttaPhotography.API/KuttaPhotography.API.csproj"

COPY . .
WORKDIR "/src/KuttaPhotography.API"
RUN dotnet build "KuttaPhotography.API.csproj" -c Release -o /app/build

FROM build-backend AS publish
RUN dotnet publish "KuttaPhotography.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# --- STAGE 3: Final Image ---
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Copy Angular build to wwwroot
# The path matches angular.json's outputPath
COPY --from=build-frontend /app/dist/kutta-photography-frontend/browser ./wwwroot/

# Ensure uploads directory exists
RUN mkdir -p wwwroot/uploads/videos

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "KuttaPhotography.API.dll"]
