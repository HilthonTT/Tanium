using System.ComponentModel.DataAnnotations;

namespace TaniumApi.Models;

public class CreateReplyModel
{
    [Required]
    [MinLength(1)]
    [MaxLength(500)]
    public string Content { get; set; }

    [Url]
    public string ImageUrl { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int PostId { get; set; }
}
