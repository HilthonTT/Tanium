CREATE PROCEDURE [dbo].[spReply_Insert]
	@Content NVARCHAR(500),
	@ImageUrl NVARCHAR(MAX) = NULL,
	@UserId INT,
	@PostId INT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @InsertedId INT;
	
	INSERT INTO [dbo].[Reply] ([Content], [ImageUrl], [UserId], [PostId])
	VALUES (@Content, @ImageUrl, @UserId, @PostId);

	SET @InsertedId = SCOPE_IDENTITY();

	SELECT [Id], [Content], [ImageUrl], [UserId], [PostId], [DateCreated], [DateUpdated]
	FROM [dbo].[Reply]
	WHERE [Id] = @InsertedId;
END