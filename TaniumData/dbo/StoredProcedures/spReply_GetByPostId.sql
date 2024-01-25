CREATE PROCEDURE [dbo].[spReply_GetByPostId]
	@PostId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [Content], [UserId], [PostId], [DateCreated], [DateUpdated]
	FROM [dbo].[Reply]
	WHERE [PostId] = @PostId
	ORDER BY [DateCreated] DESC;
END