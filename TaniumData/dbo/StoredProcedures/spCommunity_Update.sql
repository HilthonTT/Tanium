CREATE PROCEDURE [dbo].[spCommunity_Update]
	@Id INT,
	@Name NVARCHAR(50),
	@Description NVARCHAR(500)
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE [dbo].[Community]
	SET [Name] = @Name,
		[Description] = @Description,
		[DateUpdated] = GETUTCDATE()
	WHERE [Id] = @Id;
END