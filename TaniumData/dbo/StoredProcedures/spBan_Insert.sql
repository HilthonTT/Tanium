CREATE PROCEDURE [dbo].[spBan_Insert]
	@Reason NVARCHAR(500),
	@BannerUserId INT,
	@BannedUserId INT,
	@CommunityId INT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @InsertedId INT;

	INSERT INTO [dbo].[Ban] ([Reason], [BannerUserId], [BannedUserId], [CommunityId])
	VALUES (@Reason, @BannerUserId, @BannedUserId, @CommunityId);
	
	SET @InsertedId = SCOPE_IDENTITY();

	SELECT [Id], [CommunityId], [BannedUserId], [BannerUserId], [DateCreated]
	FROM [dbo].[Ban]
	WHERE [Id] = @InsertedId;
END