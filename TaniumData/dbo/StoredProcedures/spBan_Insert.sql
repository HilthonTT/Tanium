CREATE PROCEDURE [dbo].[spBan_Insert]
	@BannerUserId INT,
	@BannedUserId INT,
	@CommunityId INT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @InsertedId INT;

	INSERT INTO [dbo].[Ban] ([BannerUserId], [BannedUserId], [CommunityId])
	VALUES (@BannerUserId, @BannedUserId, @CommunityId);
	
	SET @InsertedId = SCOPE_IDENTITY();

	SELECT [Id], [CommunityId], [BannedUserId], [BannerUserId], [DateCreated]
	FROM [dbo].[Ban]
	WHERE [Id] = @InsertedId;
END