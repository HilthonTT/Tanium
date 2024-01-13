CREATE PROCEDURE [dbo].[spReply_Update]
	@Id INT,
	@Content NVARCHAR(500),
	@ImageUrl NVARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE [dbo].[Reply]
	SET [Content] = @Content,
		[ImageUrl] = @ImageUrl,
		[DateUpdated] = GETUTCDATE()
	WHERE [Id] = @Id;
END