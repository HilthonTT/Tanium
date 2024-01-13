using System.ComponentModel.DataAnnotations;

namespace TaniumApi.Models;

public class CreatePostModel
{
    [Required]
    [MinLength(1)]
    [MaxLength(50)]
    public string Title { get; set; }

    [Required]
    [MinLength(1)]
    [MaxLength(500)]
    public string Description { get; set; }

    [Required]
    public int CommunityId { get; set; }

    [Url]
    public string ImageUrl { get; set; }
}
