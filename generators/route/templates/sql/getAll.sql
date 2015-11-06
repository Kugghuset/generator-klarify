/*
Gets the top @topNum entries or every entry.

If @topNum is greater than 0, @topNum number of rows selected,
otherwise every item is selected.
*/

IF (@topNum) > 0

  SELECT TOP (@topNum)
        [<%= nameCapitalized %>ID]
      , [@url]
      , [Name]
  FROM [dbo].[<%= nameCapitalized %>];

  ELSE
    SELECT
        [<%= nameCapitalized %>ID]
      , [@url]
      , [Name]
  FROM [dbo].[<%= nameCapitalized %>];
