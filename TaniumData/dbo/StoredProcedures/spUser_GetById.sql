CREATE PROCEDURE [dbo].[spUser_GetById]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [ExternalUserId], [Username], [FirstName], [LastName], [ImageUrl], [EmailAddress], [DateCreated], [DateUpdated]
	FROM [dbo].[User]
	WHERE [Id] = @Id;
END