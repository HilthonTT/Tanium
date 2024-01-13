CREATE PROCEDURE [dbo].[spDownvote_Insert]
	@UserId INT,
	@PostId INT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @InsertedId INT;

	INSERT INTO [dbo].[DownVote] ([UserId], [PostId])
	VALUEs (@UserId, @PostId);

	SET @InsertedId = SCOPE_IDENTITY();

	SELECT [Id], [UserId], [PostId], [DateCreated]
	FROM [dbo].[DownVote]
	WHERE [Id] = @InsertedId;
END