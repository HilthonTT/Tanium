CREATE PROCEDURE [dbo].[spPost_GetByUserId]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [Title], [Description], [ImageUrl], [UserId], [CommunityId], [DateCreated], [DateUpdated]A
	FROM [dbo].[Post]
	WHERE [UserId] = @UserId;
END