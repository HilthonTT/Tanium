CREATE PROCEDURE [dbo].[spMember_Delete]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE [dbo].[Member]
	WHERE [Id] = @Id;
END