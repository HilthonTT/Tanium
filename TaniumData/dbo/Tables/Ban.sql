CREATE TABLE [dbo].[Ban]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [CommunityId] INT NOT NULL, 
    [BannedUserId] INT NOT NULL, 
    [BannerUserId] INT NULL,
    [DateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(), 
    CONSTRAINT [FK_Ban_ToUserBanned] FOREIGN KEY ([BannedUserId]) REFERENCES [dbo].[User]([Id]), 
    CONSTRAINT [FK_Ban_ToUserBanner] FOREIGN KEY ([BannerUserId]) REFERENCES [dbo].[User]([Id]) ON DELETE SET NULL,
    CONSTRAINT [FK_Ban_ToCommunity] FOREIGN KEY ([CommunityId]) REFERENCES [dbo].[Community]([Id]) ON DELETE CASCADE,
    
    CONSTRAINT [CK_Ban_UserId_Different] CHECK ([BannedUserId] <> [BannerUserId]), 
    
)

GO

CREATE INDEX [IX_Ban_BannedUserId] ON [dbo].[Ban] ([BannedUserId])

GO

CREATE INDEX [IX_Ban_BannerUserId] ON [dbo].[Ban] ([BannerUserId])

GO

CREATE INDEX [IX_Ban_Id] ON [dbo].[Ban] ([Id])

GO

CREATE INDEX [IX_Ban_CommunityId] ON [dbo].[Ban] ([CommunityId])
