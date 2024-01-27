CREATE PROCEDURE [dbo].[spBan_GetByUserIdAndCommunityId]
	@UserId INT,
	@CommunityId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [CommunityId], [BannedUserId], [BannerUserId], [DateCreated]
	FROM [dbo].[Ban]
	WHERE [BannedUserId] = @UserId AND [CommunityId] = @CommunityId;
END