using System.ComponentModel.DataAnnotations;

namespace TaniumApi.Models;

public class UpdateUserSettingsModel
{
    [Required]
    public bool IsProfilePublic { get; set; }
}
