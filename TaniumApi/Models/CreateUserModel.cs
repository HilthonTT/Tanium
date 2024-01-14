using System.ComponentModel.DataAnnotations;

namespace TaniumApi.Models;

public class CreateUserModel
{
    [Required]
    [MinLength(1)]
    [MaxLength(30)]
    public string ExternalUserId { get; set; }

    [Required]
    [MinLength(1)]
    [MaxLength(256)]
    public string Username { get; set; }

    [Required]
    [MinLength(1)]
    [MaxLength(500)]
    [EmailAddress]
    public string EmailAddress { get; set; }

    [Required]
    [MinLength(1)]
    [MaxLength(100)]
    public string FirstName { get; set; }

    [Required]
    [MinLength(1)]
    [MaxLength(100)]
    public string LastName { get; set; }

    [Url]
    public string ImageUrl { get; set; }
}
