CREATE PROCEDURE [dbo].[spPost_GetByDownvoted]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [P].[Id], [P].[Title], [P].[Description], [P].[ImageUrl], [P].[UserId], [P].[CommunityId], [P].[DateCreated], [P].[DateUpdated]
	FROM [dbo].[Post] P
	INNER JOIN [dbo].[DownVote] D ON P.Id = D.PostId
	WHERE D.[UserId] = @UserId;
END