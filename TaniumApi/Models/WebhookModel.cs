namespace TaniumApi.Models;

public class WebhookModel
{
    public string Type { get; set; }
    public string Object { get; set; }
    public UpdateUserModel Data { get; set; }
}
