﻿CREATE PROCEDURE [dbo].[spUser_GetAll]
AS
BEGIN
	SET NOCOUNT ON;

	SELECT [Id], [ExternalUserId], [Username], [FirstName], [LastName], [ImageUrl], [EmailAddress], [DateCreated], [DateUpdated]
	FROM [dbo].[User]
	ORDER BY [DateCreated] DESC;
END
