CREATE PROCEDURE [dbo].[spMember_GetByCommunityId]
	@CommunityId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [UserId], [CommunityId], [DateCreated], [DateUpdated]
	FROM [dbo].[Member]
	WHERE [CommunityId] = @CommunityId;
END
