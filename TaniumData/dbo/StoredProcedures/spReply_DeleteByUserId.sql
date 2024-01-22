CREATE PROCEDURE [dbo].[spReply_DeleteByUserId]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE [dbo].[Reply]
	WHERE [UserId] = @UserId;
END