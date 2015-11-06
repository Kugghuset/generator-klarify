/*
Gets all active <%= name %>s from the database.
*/

SELECT
      [<%= nameCapitalized %>ID]
    , [@url]
    , [Name]
FROM [dbo].[<%= nameCapitalized %>]
WHERE [IsCurrent] = 1
    AND [StartDate] > @dateSince;