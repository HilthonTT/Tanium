CREATE TABLE [dbo].[Upvote]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [UserId] INT NOT NULL, 
    [PostId] INT NOT NULL, 
    [DateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(), 
    CONSTRAINT [FK_Upvote_ToUser] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([Id]), 
    CONSTRAINT [FK_Upvote_ToPost] FOREIGN KEY ([PostId]) REFERENCES [dbo].[Post]([Id]) ON DELETE CASCADE
	
)

GO

CREATE INDEX [IX_Upvote_UserId] ON [dbo].[Upvote] ([UserId])

GO

CREATE INDEX [IX_Upvote_PostId] ON [dbo].[Upvote] ([PostId])

GO

CREATE INDEX [IX_Upvote_Id] ON [dbo].[Upvote] ([Id])
