CREATE PROCEDURE [dbo].[spPost_Insert]
	@Title NVARCHAR(50),
	@Description NVARCHAR(500),
	@CommunityId INT,
	@UserId INT,
	@ImageUrl NVARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @InsertedId INT;

	INSERT [dbo].[Post] ([Title], [Description], [CommunityId], [UserId], [ImageUrl])
	VALUES (@Title, @Description, @CommunityId, @UserId, @ImageUrl);

	SET @InsertedId = SCOPE_IDENTITY();

	SELECT [Id], [Title], [Description], [ImageUrl], [UserId], [CommunityId], [DateCreated], [DateUpdated]
	FROM [dbo].[Post]
	WHERE [Id] = @InsertedId;
END