CREATE PROCEDURE [dbo].[spBan_DeleteByUserId]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE [dbo].[Ban]
	WHERE [BannedUserId] = @UserId;
END