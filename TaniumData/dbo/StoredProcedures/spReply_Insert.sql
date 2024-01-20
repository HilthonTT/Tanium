CREATE PROCEDURE [dbo].[spReply_Insert]
	@Content NVARCHAR(500),
	@UserId INT,
	@PostId INT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @InsertedId INT;
	
	INSERT INTO [dbo].[Reply] ([Content], [UserId], [PostId])
	VALUES (@Content, @UserId, @PostId);

	SET @InsertedId = SCOPE_IDENTITY();

	SELECT [Id], [Content], [UserId], [PostId], [DateCreated], [DateUpdated]
	FROM [dbo].[Reply]
	WHERE [Id] = @InsertedId;
END