/*
Gets all active <%= name %>s from the database.
*/

SELECT
      [<%= nameCapitalized %>ID]
    , [@url]
    , [Name]
    , [IsCurrent]
FROM [dbo].[<%= nameCapitalized %>]
WHERE [IsCurrent] = 1;