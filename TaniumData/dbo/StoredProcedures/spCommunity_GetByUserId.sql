CREATE PROCEDURE [dbo].[spCommunity_GetByUserId]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT DISTINCT [c].[Id], [c].[Name], [c].[Description], [c].[ImageUrl], [c].[BannerUrl], [c].[UserId], [c].[DateCreated], [c].[DateUpdated]
    FROM [dbo].[Community] c
    INNER JOIN [dbo].[Member] m ON c.[Id] = m.[CommunityId]
    WHERE c.[UserId] = @UserId OR m.[UserId] = @UserId
    ORDER BY [c].[DateCreated] DESC;
END