CREATE PROCEDURE [dbo].[spPost_Delete]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE [dbo].[Post]
	WHERE [Id] = @Id;
END