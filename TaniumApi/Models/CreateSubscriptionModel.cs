using System.ComponentModel.DataAnnotations;

namespace TaniumApi.Models;

public class CreateSubscriptionModel
{
    [Required]
    public string SubscriptionId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    [MaxLength(50)]
    public string StripeCustomerId { get; set; }

    [Required]
    [MaxLength(50)]
    public string StripeSubscriptionId { get; set; }

    [Required]
    [MaxLength(50)]
    public string StripePriceId { get; set; }

    [Required]
    public DateTime StripeCurrentPeriodEnd { get; set; }
}
