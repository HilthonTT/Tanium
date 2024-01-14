CREATE PROCEDURE [dbo].[spCommunity_Insert]
	@Name NVARCHAR(50),
	@Description NVARCHAR(500),
	@UserId INT,
	@ImageUrl NVARCHAR(MAX) = NULL,
	@BannerUrl NVARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @InsertedId INT;

	INSERT INTO [dbo].[Community] ([Name], [Description], [UserId], [ImageUrl], [BannerUrl])
	VALUES (@Name, @Description, @UserId, @ImageUrl, @BannerUrl);

	SET @InsertedId = SCOPE_IDENTITY();

	SELECT [Id], [Name], [Description], [ImageUrl], [BannerUrl], [UserId], [DateCreated], [DateUpdated]
	FROM [dbo].[Community]
	WHERE [Id] = @InsertedId;
END