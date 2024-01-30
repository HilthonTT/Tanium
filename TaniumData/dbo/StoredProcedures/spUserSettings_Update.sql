CREATE PROCEDURE [dbo].[spUserSettings_Update]
	@UserId INT,
	@IsProfilePublic BIT
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE [dbo].[UserSettings]
	SET [IsProfilePublic] = @IsProfilePublic
	WHERE [UserId] = @UserId;

	SELECT [Id], [UserId], [IsProfilePublic]
	FROM [dbo].[UserSettings]
	WHERE [UserId] = @UserId;
END