CREATE PROCEDURE [dbo].[spMember_GetByCommunityIdAndUserId]
	@CommunityId INT,
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [UserId], [CommunityId], [DateCreated], [DateUpdated]
	FROM [dbo].[Member]
	WHERE [CommunityId] = @CommunityId AND [UserId] = @UserId;
END