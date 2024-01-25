CREATE PROCEDURE [dbo].[spReply_GetByUserId]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [Content], [UserId], [PostId], [DateCreated], [DateUpdated]
	FROM [dbo].[Reply]
	WHERE [UserId] = @UserId
	ORDER BY [DateCreated] DESC;
END