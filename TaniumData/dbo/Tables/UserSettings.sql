CREATE TABLE [dbo].[UserSettings]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [UserId] INT NOT NULL UNIQUE, 
    [IsProfilePublic] BIT NOT NULL DEFAULT 1, 
    CONSTRAINT [FK_UserSettings_ToUser] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([Id]) ON DELETE CASCADE
)

GO

CREATE INDEX [IX_UserSettings_UserId] ON [dbo].[UserSettings] ([UserId])

GO

CREATE INDEX [IX_UserSettings_Id] ON [dbo].[UserSettings] ([Id])
