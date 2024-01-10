CREATE PROCEDURE [dbo].[spUser_GetAll]
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [ExternalUserId], [Username], [FirstName], [LastName], [EmailAddress], [DateCreated], [DateUpdated]
	FROM [dbo].[User]
END
