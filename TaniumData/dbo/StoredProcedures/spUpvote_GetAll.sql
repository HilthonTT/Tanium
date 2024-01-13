CREATE PROCEDURE [dbo].[spUpvote_GetAll]
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [UserId], [PostId], [DateCreated]
	FROM [dbo].[Upvote]
END