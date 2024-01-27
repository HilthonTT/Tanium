CREATE PROCEDURE [dbo].[spBan_GetById]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;
	
	SELECT [Id], [Reason], [CommunityId], [BannedUserId], [BannerUserId], [DateCreated]
	FROM [dbo].[Ban]
	WHERE [Id] = @Id;
END