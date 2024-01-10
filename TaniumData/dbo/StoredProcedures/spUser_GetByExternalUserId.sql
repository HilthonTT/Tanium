CREATE PROCEDURE [dbo].[spUser_GetByExternalUserId]
	@ExternalUserId NVARCHAR(30)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [ExternalUserId], [Username], [FirstName], [LastName], [EmailAddress], [DateCreated], [DateUpdated]
	FROM [dbo].[User]
	WHERE [ExternalUserId] = @ExternalUserId;
END