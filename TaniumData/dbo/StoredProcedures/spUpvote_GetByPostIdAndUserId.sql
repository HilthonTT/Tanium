CREATE PROCEDURE [dbo].[spUpvote_GetByPostIdAndUserId]
	@UserId INT,
	@PostId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [UserId], [PostId], [DateCreated]
	FROM [dbo].[Upvote]
	WHERE [UserId] = @UserId AND [PostId] = @PostId;
END
