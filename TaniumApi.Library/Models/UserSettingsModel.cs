namespace TaniumApi.Library.Models;
public class UserSettingsModel
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public UserModel User { get; set; }
    public bool IsProfilePublic { get; set; }
}
