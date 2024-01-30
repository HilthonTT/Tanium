CREATE PROCEDURE [dbo].[spUserSettings_GetByUserId]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT *
	FROM [dbo].[UserSettings]
	WHERE [UserId] = @UserId;
END