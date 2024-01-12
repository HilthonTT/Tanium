CREATE PROCEDURE [dbo].[spCommunity_Delete]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE [dbo].[Community]
	WHERE [Id] = @Id;
END