CREATE PROCEDURE [dbo].[spUpvote_Insert]
	@UserId INT,
	@PostId INT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @InsertedId INT;

	INSERT INTO [dbo].[Upvote] ([UserId], [PostId])
	VALUEs (@UserId, @PostId);

	SET @InsertedId = SCOPE_IDENTITY();

    SELECT [Id], [UserId], [PostId], [DateCreated]
	FROM [dbo].[Upvote]
	WHERE [Id] = @InsertedId;
END