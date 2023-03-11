namespace Application.Core;

public class AppException
{
    public string StatusCode { get; set; }

    public string Message { get; set; }

    public string Details { get; set; }
}