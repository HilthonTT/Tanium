CREATE PROCEDURE [dbo].[spCommunity_Insert]
	@Name NVARCHAR(50),
	@Description NVARCHAR(500),
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	INSERT INTO [dbo].[Community] ([Name], [Description], [UserId])
	VALUES (@Name, @Description, @UserId);
END