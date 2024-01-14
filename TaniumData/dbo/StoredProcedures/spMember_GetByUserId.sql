CREATE PROCEDURE [dbo].[spMember_GetByUserId]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [UserId], [CommunityId], [DateCreated], [DateUpdated]
	FROM [dbo].[Member]
	WHERE [UserId] = @UserId
END