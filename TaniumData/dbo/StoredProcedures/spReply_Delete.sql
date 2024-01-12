CREATE PROCEDURE [dbo].[spReply_Delete]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE [dbo].[Reply]
	WHERE [Id] = @Id;
END