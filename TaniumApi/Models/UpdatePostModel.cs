using System.ComponentModel.DataAnnotations;

namespace TaniumApi.Models;

public class UpdatePostModel
{
    [Required]
    [Range(0, int.MaxValue)]
    public int Id { get; set; }

    [Required]
    [MinLength(1)]
    [MaxLength(50)]
    public string Title { get; set; }

    [Required]
    [MinLength(1)]
    [MaxLength(500)]
    public string Description { get; set; }

    [Url]
    public string ImageUrl { get; set; }
}
