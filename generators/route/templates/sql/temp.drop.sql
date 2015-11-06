/*
Drops the table if it exists.
*/

IF (OBJECT_ID('Temp<%= nameCapitalized %>', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[Temp<%= nameCapitalized %>];
END
