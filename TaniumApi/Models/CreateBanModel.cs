using System.ComponentModel.DataAnnotations;

namespace TaniumApi.Models;

public class CreateBanModel
{
    [Required]
    [MinLength(1)]
    [MaxLength(500)]
    public string Reason { get; set; }

    [Required]
    public int BannedUserId { get; set; }

    [Required]
    public int CommunityId { get; set; }
}
