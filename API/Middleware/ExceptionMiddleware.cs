using System.Net;
using System.Text.Json;
using Application.Core;

namespace API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "{EMessage}", e.Message);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var respone = _env.IsDevelopment()
                ? new AppException
                    { StatusCode = context.Response.StatusCode.ToString(), Message = e.Message, Details = e.StackTrace }
                : new AppException
                    { StatusCode = context.Response.StatusCode.ToString(), Message = "Internal server error" };

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            var json = JsonSerializer.Serialize(respone, options);
            await context.Response.WriteAsync(json);
        }
    }
}