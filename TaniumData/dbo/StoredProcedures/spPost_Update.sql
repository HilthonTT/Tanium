CREATE PROCEDURE [dbo].[spPost_Update]
	@Id INT,
	@Title NVARCHAR(50),
	@Description NVARCHAR(500),
	@ImageUrl NVARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE [dbo].[Post]
	SET [Title] = @Title,
		[Description] = @Description,
		[ImageUrl] = @ImageUrl
	WHERE [Id] = @Id;

	SELECT [Id], [Title], [Description], [ImageUrl], [UserId], [CommunityId], [DateCreated], [DateUpdated]
	FROM [dbo].[Post]
	WHERE [Id] = @Id;
END