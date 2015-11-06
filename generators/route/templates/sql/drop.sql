/*
Drops the table if it exists.
*/

IF (OBJECT_ID('<%= nameCapitalized %>', 'U') IS NOT NULL)
BEGIN
  DROP TABLE [dbo].[<%= nameCapitalized %>];
END
