CREATE TABLE [dbo].[User]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [ExternalUserId] NVARCHAR(30) NOT NULL UNIQUE, 
    [Username] NVARCHAR(256) NOT NULL, 
    [FirstName] NVARCHAR(100) NOT NULL, 
    [LastName] NVARCHAR(100) NOT NULL, 
    [ImageUrl] NVARCHAR(MAX) NULL,
    [EmailAddress] NVARCHAR(500) NOT NULL, 
    [DateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(), 
    [DateUpdated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(), 
)

GO

CREATE INDEX [IX_User_Id] ON [dbo].[User] ([Id])

GO

CREATE INDEX [IX_User_ExternalUserId] ON [dbo].[User] ([ExternalUserId])
