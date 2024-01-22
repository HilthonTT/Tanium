CREATE PROCEDURE [dbo].[spCommunity_DeleteByUserId]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE [dbo].[Community]
	WHERE [UserId] = @UserId;
END