/*
Sets a <%= nameCapitalized %> to disabled.
*/

UPDATE [dbo].[<%= nameCapitalized %>]
SET
    [<%= nameCapitalized %>].[IsCurrent] = 1
  , [<%= nameCapitalized %>].[EndDate] = GETUTCDATE()
  , [<%= nameCapitalized %>].[LastUpdated] = GETUTCDATE()
Where [<%= nameCapitalized %>ID] = @<%= name %>ID;
