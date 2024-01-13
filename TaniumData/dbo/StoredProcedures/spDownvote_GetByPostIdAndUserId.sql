CREATE PROCEDURE [dbo].[spDownvote_GetByPostIdAndUserId]
	@UserId INT,
	@PostId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [UserId], [PostId], [DateCreated]
	FROM [dbo].[DownVote]
	WHERE [UserId] = @UserId AND [PostId] = @PostId;
END

