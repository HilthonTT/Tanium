CREATE PROCEDURE [dbo].[spMember_Insert]
	@UserId INT,
	@CommunityId INT
AS
BEGIN
	SET NOCOUNT ON;

	INSERT INTO [dbo].[Member] ([UserId], [CommunityId])
	VALUES (@UserId, @CommunityId);
END