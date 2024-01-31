CREATE PROCEDURE [dbo].[spSubscription_GetByUserId]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [StripeCustomerId], [StripeSubscriptionId], [StripePriceId], [StripeCurrentPeriodEnd], [UserId]
	FROM [dbo].[Subscription]
	WHERE [UserId] = @UserId;
END