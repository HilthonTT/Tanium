CREATE PROCEDURE [dbo].[spReply_GetById]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [Content], [UserId], [PostId], [DateCreated], [DateUpdated]
	FROM [dbo].[Reply]
	WHERE [Id] = @Id;
END