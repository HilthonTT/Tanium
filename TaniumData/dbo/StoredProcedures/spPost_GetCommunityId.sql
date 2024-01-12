CREATE PROCEDURE [dbo].[spPost_GetCommunityId]
	@CommunityId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [Title], [Description], [ImageUrl], [CommunityId], [DateCreated], [DateUpdated]
	FROM [dbo].[Post]
	WHERE [CommunityId] = @CommunityId;
END