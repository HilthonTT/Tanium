CREATE PROCEDURE [dbo].[spUser_UpdateByExternalUserId]
	@ExternalUserId NVARCHAR(30),
	@Username NVARCHAR(256),
	@FirstName NVARCHAR(100),
	@LastName NVARCHAR(100),
	@EmailAddress NVARCHAR(500),
	@ImageUrl NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE [dbo].[User]
	SET [Username] = @Username,
		[FirstName] = @FirstName,
		[LastName] = @LastName,
		[EmailAddress] = @EmailAddress,
		[ImageUrl] = @ImageUrl,
		[DateUpdated] = GETUTCDATE()
	WHERE [ExternalUserId] = @ExternalUserId;

	SELECT [Id], [ExternalUserId], [Username], [FirstName], [LastName], [ImageUrl], [EmailAddress], [DateCreated], [DateUpdated]
	FROM [dbo].[User]
	WHERE [ExternalUserId] = @ExternalUserId;
END