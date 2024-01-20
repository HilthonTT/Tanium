CREATE PROCEDURE [dbo].[spUser_DeleteByExternalUserId]
	@ExternalUserId NVARCHAR(30)
AS
BEGIN
	SET NOCOUNT ON;

	DELETE [dbo].[User]
	WHERE [ExternalUserId] = @ExternalUserId;
END