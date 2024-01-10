CREATE PROCEDURE [dbo].[spUser_Delete]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;
	
	DELETE [dbo].[User]
	WHERE [Id] = @Id;
END