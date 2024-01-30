CREATE PROCEDURE [dbo].[spUserSettings_Insert]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @InsertedId INT;

	INSERT INTO [dbo].[UserSettings] ([UserId])
	VALUES (@UserId);

	SET @InsertedId = SCOPE_IDENTITY();

	SELECT [Id], [UserId], [IsProfilePublic]
	FROM [dbo].[UserSettings]
	WHERE [Id] = @InsertedId;
END