CREATE PROCEDURE [dbo].[spMember_GetById]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE [dbo].[Member]
	WHERE [Id] = @Id;
END