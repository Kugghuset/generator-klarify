/*
On start, create the <%= nameCapitalized %> table if it's not present.
*/

IF (OBJECT_ID('<%= nameCapitalized %>', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[<%= nameCapitalized %>] (
    [<%= nameCapitalized %>ID] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [@url] nvarchar(max) NULL,
    [Name] nvarchar(1024) NULL,
    [IsCurrent] bit NULL DEFAULT 1,
    [StartDate] datetime2 NULL DEFAULT GETUTCDATE(),
    [EndDate] datetime2 NULL,
    [LastUpdated] datetime2 NULL DEFAULT GETUTCDATE()
  )
END
