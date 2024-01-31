CREATE TABLE [dbo].[Subscription]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [StripeCustomerId] NVARCHAR(50) UNIQUE NOT NULL, 
    [StripeSubscriptionId] NVARCHAR(50) UNIQUE NOT NULL, 
    [StripePriceId] NVARCHAR(50) UNIQUE NOT NULL, 
    [StripeCurrentPeriodEnd] DATETIME2 NOT NULL,
    [UserId] INT NOT NULL UNIQUE,
    CONSTRAINT [FK_Subscription_ToUser] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([Id]) ON DELETE CASCADE
)

GO

CREATE INDEX [IX_Subscription_Id] ON [dbo].[Subscription] ([Id])

GO

CREATE INDEX [IX_Subscription_UserId] ON [dbo].[Subscription] ([UserId])
