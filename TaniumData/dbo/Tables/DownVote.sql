CREATE TABLE [dbo].[DownVote]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [UserId] INT NOT NULL, 
    [PostId] INT NOT NULL, 
    [DateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(), 
    CONSTRAINT [FK_Downvote_ToUser] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([Id]),
    CONSTRAINT [FK_Downvote_ToPost] FOREIGN KEY ([PostId]) REFERENCES [dbo].[Post]([Id]) ON DELETE CASCADE
)

GO

CREATE INDEX [IX_Downvote_UserId] ON [dbo].[DownVote] ([UserId])

GO

CREATE INDEX [IX_Downvote_PostId] ON [dbo].[DownVote] ([PostId])
