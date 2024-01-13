using System.ComponentModel.DataAnnotations;

namespace TaniumApi.Models;

public class UpdateReplyModel
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MinLength(1)]
    [MaxLength(500)]
    public string Content { get; set; }

    [Url]
    public string ImageUrl { get; set; }
}
