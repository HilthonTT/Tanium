CREATE PROCEDURE [dbo].[spPost_GetById]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [Title], [Description], [ImageUrl], [UserId], [CommunityId], [DateCreated], [DateUpdated]
	FROM [dbo].[Post]
	WHERE [Id] = @Id;
END