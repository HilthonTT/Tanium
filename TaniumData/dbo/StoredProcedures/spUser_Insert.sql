CREATE PROCEDURE [dbo].[spUser_Insert]
    @ExternalUserId NVARCHAR(30),
    @Username NVARCHAR(256),
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @EmailAddress NVARCHAR(500),
    @ImageUrl NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @InsertedId INT;

    INSERT INTO [dbo].[User] ([ExternalUserId], [Username], [FirstName], [LastName], [EmailAddress], [ImageUrl])
    VALUES (@ExternalUserId, @Username, @FirstName, @LastName, @EmailAddress, @ImageUrl);

    SET @InsertedId = SCOPE_IDENTITY();

    SELECT [Id], [ExternalUserId], [Username], [FirstName], [LastName], [EmailAddress], [DateCreated], [DateUpdated] 
    FROM [dbo].[User]
    WHERE [Id] = @InsertedId
END
