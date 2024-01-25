CREATE PROCEDURE [dbo].[spReply_Update]
	@Id INT,
	@Content NVARCHAR(500)
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE [dbo].[Reply]
	SET [Content] = @Content,
		[DateUpdated] = GETUTCDATE()
	WHERE [Id] = @Id;

	SELECT [Id], [Content], [UserId], [PostId], [DateCreated], [DateUpdated]
	FROM [dbo].[Reply]
	WHERE [Id] = @Id;
END