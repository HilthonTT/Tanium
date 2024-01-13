CREATE PROCEDURE [dbo].[spUpvote_Delete]
	@UserId INT,
	@PostId INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE [dbo].[Upvote]
	WHERE [UserId] = @UserId AND [PostId] = @PostId;
END