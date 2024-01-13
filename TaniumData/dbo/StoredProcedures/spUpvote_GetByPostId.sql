CREATE PROCEDURE [dbo].[spUpvote_GetByPostId]
	@PostId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [UserId], [PostId], [DateCreated]
	FROM [dbo].[Upvote]
	WHERE [PostId] = @PostId;
END