CREATE PROCEDURE [dbo].[spCommunity_GetCreatedByUserId]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [Name], [Description], [ImageUrl], [BannerUrl], [UserId], [DateCreated], [DateUpdated]
	FROM [dbo].[Community]
	WHERE [UserId] = @UserId;
END
