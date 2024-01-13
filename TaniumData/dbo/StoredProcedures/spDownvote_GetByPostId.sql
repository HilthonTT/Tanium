CREATE PROCEDURE [dbo].[spDownvote_GetByPostId]
	@PostId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [UserId], [PostId], [DateCreated]
	FROM [dbo].[DownVote]
	WHERE [PostId] = @PostId;
END