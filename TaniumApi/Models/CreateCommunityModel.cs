using System.ComponentModel.DataAnnotations;

namespace TaniumApi.Models;

public class CreateCommunityModel
{
    [Required]
    [MinLength(1)]
    [MaxLength(50)]
    public string Name { get; set; }

    [Required]
    [MinLength(1)]
    [MaxLength(500)]
    public string Description { get; set; }
}
