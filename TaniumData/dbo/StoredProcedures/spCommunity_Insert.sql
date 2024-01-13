CREATE PROCEDURE [dbo].[spCommunity_Insert]
	@Name NVARCHAR(50),
	@Description NVARCHAR(500),
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @InsertedId INT;

	INSERT INTO [dbo].[Community] ([Name], [Description], [UserId])
	VALUES (@Name, @Description, @UserId);

	SET @InsertedId = SCOPE_IDENTITY();

	SELECT [Id], [Name], [Description], [UserId], [DateCreated], [DateUpdated]
	FROM [dbo].[Community]
	WHERE [Id] = @InsertedId;
END