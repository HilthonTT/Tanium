CREATE TABLE [dbo].[Community]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Name] NVARCHAR(50) NOT NULL, 
    [Description] NVARCHAR(500) NOT NULL, 
    [ImageUrl] NVARCHAR(MAX) NULL, 
    [BannerUrl] NVARCHAR(MAX) NULL, 
    [UserId] INT NOT NULL, 
    [DateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(), 
    [DateUpdated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(), 
    CONSTRAINT [FK_Community_ToUser] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([Id])
)

GO

CREATE INDEX [IX_Community_UserId] ON [dbo].[Community] ([UserId])

GO

CREATE INDEX [IX_Community_Id] ON [dbo].[Community] ([Id])
