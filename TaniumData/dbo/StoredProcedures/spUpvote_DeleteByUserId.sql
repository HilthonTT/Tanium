CREATE PROCEDURE [dbo].[spUpvote_DeleteByUserId]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE [dbo].[Upvote]
	WHERE [UserId] = @UserId;
END