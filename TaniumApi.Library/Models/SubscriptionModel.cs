namespace TaniumApi.Library.Models;
public class SubscriptionModel
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string StripeCustomerId { get; set; }
    public string StripeSubscriptionId { get; set; }
    public string StripePriceId { get; set; }
    public DateTime StripeCurrentPeriodEnd { get; set; }
}
