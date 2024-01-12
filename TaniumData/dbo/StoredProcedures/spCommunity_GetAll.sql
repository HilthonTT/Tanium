CREATE PROCEDURE [dbo].[spCommunity_GetAll]
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [Name], [Description], [UserId], [DateCreated], [DateUpdated]
	FROM [dbo].[Community]
END