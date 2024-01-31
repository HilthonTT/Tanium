CREATE PROCEDURE [dbo].[spSubscription_Update]
	@StripeSubscriptionId NVARCHAR(50),
	@StripePriceId NVARCHAR(50),
	@StripeCurrentPeriodEnd DATETIME2
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE [dbo].[Subscription]
	SET [StripePriceId] = @StripePriceId,
		[StripeCurrentPeriodEnd] = @StripeCurrentPeriodEnd
	WHERE [StripeSubscriptionId] = @StripeSubscriptionId

	SELECT [Id], [StripeCustomerId], [StripeSubscriptionId], [StripePriceId], [StripeCurrentPeriodEnd], [UserId]
	FROM [dbo].[Subscription]
	WHERE [StripeSubscriptionId] = @StripeSubscriptionId
END