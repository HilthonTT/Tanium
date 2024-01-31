CREATE PROCEDURE [dbo].[spSubscription_Insert]
	@UserId INT,
	@StripeCustomerId NVARCHAR(50),
	@StripeSubscriptionId NVARCHAR(50),
	@StripePriceId NVARCHAR(50),
	@StripeCurrentPeriodEnd DATETIME2
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @InsertedId INT;

	INSERT INTO [dbo].[Subscription] ([UserId], [StripeCustomerId], [StripeSubscriptionId], [StripePriceId], [StripeCurrentPeriodEnd])
	VALUES (@UserId, @StripeCustomerId, @StripeSubscriptionId, @StripePriceId, @StripeCurrentPeriodEnd);

	SET @InsertedId = SCOPE_IDENTITY();

	SELECT [Id], [StripeCustomerId], [StripeSubscriptionId], [StripePriceId], [StripeCurrentPeriodEnd], [UserId]
	FROM [dbo].[Subscription]
	WHERE [Id] = @InsertedId;
END