using System.ComponentModel.DataAnnotations;

namespace TaniumApi.Models;

public class CreateUserModel
{
    [Required(ErrorMessage = "External User ID is required")]
    [MinLength(1, ErrorMessage = "The minimum length of the External User ID is 1")]
    [MaxLength(30, ErrorMessage = "The maximum length of the External user ID is 30")]
    public string ExternalUserId { get; set; }

    [Required(ErrorMessage = "Username is required")]
    [MinLength(1, ErrorMessage = "The minimum length of the username is 1")]
    [MaxLength(256, ErrorMessage = "The maximum length of the username is 256")]
    public string Username { get; set; }

    [Required(ErrorMessage = "Email Address is required")]
    [MinLength(1, ErrorMessage = "The minimum length of the email address is 1")]
    [MaxLength(500, ErrorMessage = "The maximum length of the email address is 500")]
    [EmailAddress(ErrorMessage = "Invalid Email Address")]
    public string EmailAddress { get; set; }

    [Required(ErrorMessage = "First Name is required")]
    [MinLength(1, ErrorMessage = "The minimum length of the first name is 1")]
    [MaxLength(100, ErrorMessage = "The maximum length of the first name is 100")]
    public string FirstName { get; set; }

    [Required(ErrorMessage = "Last Name is required")]
    [MinLength(1, ErrorMessage = "The minimum length of the last name is 1")]
    [MaxLength(100, ErrorMessage = "The maximum length of the last name is 100")]
    public string LastName { get; set; }
}
