using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Stripe.Checkout;
using TaniumApi.Authentication.Interfaces;
using TaniumApi.Library.DataAccess.Interfaces;

namespace TaniumApi.Controllers;
[Route("api/[controller]")]
[ApiController]
[Authorize]
[EnableCors]
[EnableRateLimiting("fixed")]
public class StripeController(
    IConfiguration config,
    IAuthService authService,
    ISubscriptionData subscriptionData,
    ILogger<StripeController> logger) : ControllerBase
{
    private readonly string _frontEndUrl = config["AllowedOrigins:Url"];
    private readonly IAuthService _authService = authService;
    private readonly ISubscriptionData _subscriptionData = subscriptionData;
    private readonly ILogger<StripeController> _logger = logger;

    private string GetSettingsPageUrl()
    {
        return $"{_frontEndUrl}/settings";
    }

    [HttpGet]
    public async Task<IActionResult> GetPortalAsync()
    {
        try
        {
            string settingsUrl = GetSettingsPageUrl();

            var loggedInUser = await _authService.GetUserFromAuthAsync(HttpContext);
            if (loggedInUser is null)
            {
                return StatusCode(401, "Unauthorized");
            }

            var userSubscription = await _subscriptionData.GetUserSubscriptionAsync(loggedInUser.Id);
            if (string.IsNullOrWhiteSpace(userSubscription?.StripeCustomerId) is false)
            {
                var billingService = new Stripe.BillingPortal.SessionService();

                var billingOptions = new Stripe.BillingPortal.SessionCreateOptions()
                {
                    ReturnUrl = settingsUrl,
                    Customer = userSubscription?.StripeCustomerId,
                };
                
                var session = await billingService.CreateAsync(billingOptions);

                return Ok(session.Url);
            }

            var checkoutOptions = new Stripe.Checkout.SessionCreateOptions()
            {
                SuccessUrl = settingsUrl,
                CancelUrl = settingsUrl,
                PaymentMethodTypes = ["card", "paypal"],
                Mode = "subscription",
                BillingAddressCollection = "auto",
                CustomerEmail = loggedInUser.EmailAddress,
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions()
                        {
                            Currency = "eur",
                            ProductData = new()
                            {
                                Name = "Tanium Pro",
                                Description = "Create more than 5 communities!",
                            },
                            UnitAmount = 999,
                            Recurring = new()
                            {
                                Interval = "month"
                            }
                        },
                        Quantity = 1,
                    },

                },
                Metadata = new Dictionary<string, string>()
                {
                    { "UserId", loggedInUser.Id.ToString() },
                }
            };

            var checkoutService = new Stripe.Checkout.SessionService();

            var stripeSession = await checkoutService.CreateAsync(checkoutOptions);

            return Ok(stripeSession.Url);
        }
        catch (Exception ex)
        {
            _logger.LogError("[STRIPE_CONTROLLER_GET]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }
}
