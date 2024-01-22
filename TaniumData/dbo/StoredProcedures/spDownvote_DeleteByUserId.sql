CREATE PROCEDURE [dbo].[spDownvote_DeleteByUserId]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE [dbo].[DownVote]
	WHERE [UserId] = @UserId;
END