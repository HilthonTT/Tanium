using System.ComponentModel.DataAnnotations;

namespace TaniumApi.Models;

public class UpdateUserModel
{
    [Required]
    [Range(0, int.MaxValue)]
    public int Id { get; set; }

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
}
