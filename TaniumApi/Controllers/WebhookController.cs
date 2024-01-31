using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using TaniumApi.Library.DataAccess.Interfaces;
using TaniumApi.Library.Models;
using CheckoutSession = Stripe.Checkout.Session;

namespace TaniumApi.Controllers;
[Route("api/[controller]")]
[ApiController]
[EnableCors("OpenCors")]
public class WebhookController : ControllerBase
{
    private readonly string _endpointSecret;
    private readonly IConfiguration _config;
    private readonly ISubscriptionData _subscriptionData;
    private readonly ILogger<WebhookController> _logger;

    public WebhookController(
        IConfiguration config,
        ISubscriptionData subscriptionData,
        ILogger<WebhookController> logger)
    {
        _config = config;
        _subscriptionData = subscriptionData;
        _logger = logger;
        _endpointSecret = _config["Stripe:WebhookSecret"];
    }

    private async Task HandleCheckoutSessionCompletedAsync(Subscription subscription, CheckoutSession session)
    {
        if (session.Metadata.TryGetValue("UserId", out string userId) is false || 
            int.TryParse(userId, out int parsedUserId) is false)
        {
            throw new Exception("User ID is missing");
        }

        var data = new SubscriptionModel()
        {
            UserId = parsedUserId,
            StripeCustomerId = subscription.CustomerId,
            StripeSubscriptionId = subscription.Id,
            StripePriceId = subscription.Items.Data[0].Price.Id,
            StripeCurrentPeriodEnd = subscription.CurrentPeriodEnd,
        };

        await _subscriptionData.CreateSubscriptionAsync(data);
    }

    private async Task HandleInvoicePaymentSucceededAsync(Subscription subscription)
    {
        var data = new SubscriptionModel()
        {
            StripeSubscriptionId = subscription.Id,
            StripePriceId = subscription.Items.Data[0].Price.Id,
            StripeCurrentPeriodEnd = subscription.CurrentPeriodEnd,
        };

        await _subscriptionData.UpdateSubscriptionAsync(data);
    }


    [HttpPost("stripe")]
    [AllowAnonymous]
    public async Task<IActionResult> StripeHandlerAsync()
    {
        try
        {
            string json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            string stripeSignature = Request.Headers["Stripe-Signature"];
           
            var stripeEvent = EventUtility.ConstructEvent(json, stripeSignature, _endpointSecret);
            if (stripeEvent.Data.Object is not CheckoutSession session)
            {
                return BadRequest("Session not found");
            }

            var stripeSubscriptionService = new SubscriptionService();
            var subscription = await stripeSubscriptionService.GetAsync(session.Subscription.Id);
            if (subscription is null)
            {
                return BadRequest("Subscription not found");
            }

            switch(stripeEvent.Type)
            {
                case Events.CheckoutSessionCompleted:
                    await HandleCheckoutSessionCompletedAsync(subscription, session);
                    break;

                case Events.InvoicePaymentSucceeded:
                    await HandleInvoicePaymentSucceededAsync(subscription);
                    break;

                default:
                    _logger.LogWarning("[WEBHOOK_CONTROLLER_STRIPE]: Unhandled Stripe event type: {eventType}", stripeEvent.Type);
                    break;
            }

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError("[WEBHOOK_CONTROLLER_STRIPE]: {error}", ex.Message);
            return StatusCode(500, "Internal Error");
        }
    }
}
