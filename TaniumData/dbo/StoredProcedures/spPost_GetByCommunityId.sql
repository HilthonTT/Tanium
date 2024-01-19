CREATE PROCEDURE [dbo].[spPost_GetByCommunityId]
	@CommunityId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [Title], [Description], [ImageUrl], [UserId], [CommunityId], [DateCreated], [DateUpdated]
	FROM [dbo].[Post]
	WHERE [CommunityId] = @CommunityId;
END