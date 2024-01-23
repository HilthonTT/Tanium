CREATE PROCEDURE [dbo].[spPost_GetUpvoted]
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [P].[Id], [P].[Title], [P].[Description], [P].[ImageUrl], [P].[UserId], [P].[CommunityId], [P].[DateCreated], [P].[DateUpdated]
	FROM [dbo].[Post] P
	INNER JOIN [dbo].[Upvote] U ON P.Id = U.PostId
	WHERE U.[UserId] = @UserId;
END