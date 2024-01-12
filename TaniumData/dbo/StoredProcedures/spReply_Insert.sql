CREATE PROCEDURE [dbo].[spReply_Insert]
	@Content NVARCHAR(500),
	@UserId INT,
	@PostId INT
AS
BEGIN
	SET NOCOUNT ON;
	
	INSERT INTO [dbo].[Reply] ([Content], [UserId], [PostId])
	VALUES (@Content, @UserId, @PostId);
END