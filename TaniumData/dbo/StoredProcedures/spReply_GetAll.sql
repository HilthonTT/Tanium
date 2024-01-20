CREATE PROCEDURE [dbo].[spReply_GetAll]
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [Content], [UserId], [PostId], [DateCreated], [DateUpdated]
	FROM [dbo].[Reply]
END