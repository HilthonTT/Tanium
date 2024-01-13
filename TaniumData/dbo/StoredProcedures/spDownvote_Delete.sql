CREATE PROCEDURE [dbo].[spDownvote_Delete]
	@UserId INT,
	@PostId INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE [dbo].[DownVote]
	WHERE [UserId] = @UserId AND [PostId] = @PostId;
END