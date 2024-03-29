﻿CREATE PROCEDURE [dbo].[spBan_GetByCommunityId]
	@CommunityId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [Reason], [CommunityId], [BannedUserId], [BannerUserId], [DateCreated]
	FROM [dbo].[Ban]
	WHERE [CommunityId] = @CommunityId;
END