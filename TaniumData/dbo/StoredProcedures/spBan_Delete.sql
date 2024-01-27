CREATE PROCEDURE [dbo].[spBan_Delete]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE [dbo].[Ban]
	WHERE [Id] = @Id;
END