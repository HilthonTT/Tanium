CREATE PROCEDURE [dbo].[spCommunity_Update]
	@Id INT,
	@Name NVARCHAR(50),
	@Description NVARCHAR(500),
	@ImageUrl NVARCHAR(MAX) = NULL,
	@BannerUrl NVARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE [dbo].[Community]
	SET [Name] = @Name,
		[Description] = @Description,
		[ImageUrl] = @ImageUrl,
		[BannerUrl] = @BannerUrl,
		[DateUpdated] = GETUTCDATE()
	WHERE [Id] = @Id;

	SELECT [Id], [Name], [Description], [ImageUrl], [BannerUrl], [UserId], [DateCreated], [DateUpdated]
	FROM [dbo].[Community]
	WHERE [Id] = @Id;
END