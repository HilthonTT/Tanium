CREATE TABLE [dbo].[Post]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Title] NVARCHAR(50) NOT NULL, 
    [Description] NVARCHAR(500) NOT NULL, 
    [ImageUrl] NVARCHAR(MAX) NULL, 
    [UserId] INT NOT NULL, 
    [CommunityId] INT NOT NULL,     
    [DateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(), 
    [DateUpdated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(), 
    CONSTRAINT [FK_Post_ToCommunity] FOREIGN KEY ([CommunityId]) REFERENCES [dbo].[Community]([Id]), 
    CONSTRAINT [FK_Post_ToUser] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([Id])
)

GO

CREATE INDEX [IX_Post_CommunityId] ON [dbo].[Post] ([CommunityId])
