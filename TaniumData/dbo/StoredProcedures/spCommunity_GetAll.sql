CREATE PROCEDURE [dbo].[spCommunity_GetAll]
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [Name], [Description], [ImageUrl], [BannerUrl], [UserId], [DateCreated], [DateUpdated]
	FROM [dbo].[Community]
	ORDER BY [DateCreated] DESC;
END