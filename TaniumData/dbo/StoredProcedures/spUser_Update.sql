CREATE PROCEDURE [dbo].[spUser_Update]
	@Id INT,
	@Username NVARCHAR(256),
	@FirstName NVARCHAR(100),
	@LastName NVARCHAR(100),
	@EmailAddress NVARCHAR(500)
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE [dbo].[User] 
	SET [Username] = @Username,
		[FirstName] = @FirstName,
		[LastName] = @LastName,
		[EmailAddress] = @EmailAddress
	WHERE [Id] = @Id;

	SELECT [Id], [ExternalUserId], [Username], [FirstName], [LastName], [EmailAddress], [DateCreated], [DateUpdated]
	FROM [dbo].[User]
	WHERE [Id] = @Id;
END