CREATE PROCEDURE [dbo].[spMember_DeleteByUserIdAndCommunityId]
	@UserId INT,
	@CommunityId INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE [dbo].[Member]
	WHERE [UserId] = @UserId AND [CommunityId] = @CommunityId;
END