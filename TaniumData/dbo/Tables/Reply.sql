CREATE TABLE [dbo].[Reply]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Content] NVARCHAR(500) NOT NULL, 
    [UserId] INT NOT NULL, 
    [PostId] INT NOT NULL, 
    [DateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(), 
    [DateUpdated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(), 
    CONSTRAINT [FK_Reply_ToUser] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([Id]),
    CONSTRAINT [FK_Reply_ToPost] FOREIGN KEY ([PostId]) REFERENCES [dbo].[Post]([Id]) ON DELETE CASCADE,
)

GO

CREATE INDEX [IX_Reply_User] ON [dbo].[Reply] ([UserId])

GO


CREATE INDEX [IX_Reply_Post] ON [dbo].[Reply] ([PostId])
