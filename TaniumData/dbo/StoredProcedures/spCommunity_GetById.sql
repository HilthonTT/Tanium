CREATE PROCEDURE [dbo].[spCommunity_GetById]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [Name], [Description], [ImageUrl], [BannerUrl], [UserId], [DateCreated], [DateUpdated]
	FROM [dbo].[Community]
	WHERE [Id] = @Id;
END