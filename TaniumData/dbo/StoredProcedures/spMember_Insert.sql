CREATE PROCEDURE [dbo].[spMember_Insert]
	@UserId INT,
	@CommunityId INT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @InsertedId INT;

	INSERT INTO [dbo].[Member] ([UserId], [CommunityId])
	VALUES (@UserId, @CommunityId);

	SET @InsertedId = SCOPE_IDENTITY();

	SELECT [Id], [UserId], [CommunityId], [DateCreated], [DateUpdated]
	FROM [dbo].[Member]
	WHERE [Id] = @InsertedId;
END