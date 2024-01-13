CREATE PROCEDURE [dbo].[spReply_Insert]
	@Content NVARCHAR(500),
	@ImageUrl NVARCHAR(MAX) = NULL,
	@UserId INT,
	@PostId INT
AS
BEGIN
	SET NOCOUNT ON;
	
	INSERT INTO [dbo].[Reply] ([Content], [ImageUrl], [UserId], [PostId])
	VALUES (@Content, @ImageUrl, @UserId, @PostId);
END