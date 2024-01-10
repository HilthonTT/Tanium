CREATE PROCEDURE [dbo].[spUser_Insert]
	@ExternalUserId NVARCHAR(30),
	@Username NVARCHAR(256),
	@FirstName NVARCHAR(100),
	@LastName NVARCHAR(100),
	@EmailAddress NVARCHAR(500)
AS
BEGIN
	SET NOCOUNT ON;

	INSERT INTO [dbo].[User] ([ExternalUserId], [Username], [FirstName], [LastName], [EmailAddress])
	VALUES (@ExternalUserId, @Username, @FirstName, @LastName, @EmailAddress)
END