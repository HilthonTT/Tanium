CREATE PROCEDURE [dbo].[spDownvote_GetAll]
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [UserId], [PostId], [DateCreated]
	FROM [dbo].[DownVote]
END	