CREATE PROCEDURE [dbo].[spPost_GetAll]
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [Title], [Description], [ImageUrl], [UserId], [CommunityId], [DateCreated], [DateUpdated]
	FROM [dbo].[Post]
	ORDER BY [DateUpdated] DESC;
END
