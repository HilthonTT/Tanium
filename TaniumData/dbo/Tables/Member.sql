﻿CREATE TABLE [dbo].[Member]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [UserId] INT NOT NULL, 
    [CommunityId] INT NOT NULL, 
    [DateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(), 
    [DateUpdated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(), 
    CONSTRAINT [FK_Member_ToUser] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Member_ToCommunity] FOREIGN KEY ([CommunityId]) REFERENCES [dbo].[Community]([Id]) ON DELETE CASCADE
)

GO

CREATE INDEX [IX_Member_UserId] ON [dbo].[Member] ([UserId])

GO

CREATE INDEX [IX_Member_CommunityId] ON [dbo].[Member] ([CommunityId])

GO

CREATE INDEX [IX_Member_Id] ON [dbo].[Member] ([Id])
