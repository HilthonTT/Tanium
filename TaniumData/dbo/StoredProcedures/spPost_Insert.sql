CREATE PROCEDURE [dbo].[spPost_Insert]
	@Title NVARCHAR(50),
	@Description NVARCHAR(500),
	@CommunityId INT,
	@UserId INT,
	@ImageUrl NVARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;

	INSERT [dbo].[Post] ([Title], [Description], [CommunityId], [UserId], [ImageUrl])
	VALUES (@Title, @Description, @CommunityId, @UserId, @ImageUrl);
END